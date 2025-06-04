import express from 'express';
import Job from '../models/Job.js';
import Category from '../models/Category.js';
import Country from '../models/Country.js';

const router = express.Router();

// GET /api/jobs - Get all jobs with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      country,
      jobType,
      experienceLevel,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive = true
    } = req.query;

    // Build filter object
    const filter = { isActive: isActive === 'true' };

    if (category) filter.category = category;
    if (country) filter.country = country;
    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // Add search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const jobs = await Job.find(filter)
      .populate('category', 'name slug color')
      .populate('country', 'name code flag')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// GET /api/jobs/all - Return ALL jobs with full population, no filters or pagination
router.get('/all', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('category', 'name slug color')
      .populate('country', 'name code flag')
      .lean();

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all jobs',
      error: error.message
    });
  }
});


// GET /api/jobs/:id - Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('category', 'name slug color icon')
      .populate('country', 'name code flag currency');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// POST /api/jobs - Create new job
router.post('/', async (req, res) => {
  try {
    // Validate category and country exist
    const [category, country] = await Promise.all([
      Category.findById(req.body.category),
      Country.findById(req.body.country)
    ]);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Invalid country ID'
      });
    }

    const job = new Job(req.body);
    await job.save();

    // Update category and country job counts
    await Promise.all([
      Category.findByIdAndUpdate(req.body.category, { $inc: { jobCount: 1 } }),
      Country.findByIdAndUpdate(req.body.country, { $inc: { jobCount: 1 } })
    ]);

    const populatedJob = await Job.findById(job._id)
      .populate('category', 'name slug color')
      .populate('country', 'name code flag');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: populatedJob
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

// PUT /api/jobs/:id - Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // If category or country is being changed, validate them
    if (req.body.category && req.body.category !== job.category.toString()) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }
    }

    if (req.body.country && req.body.country !== job.country.toString()) {
      const country = await Country.findById(req.body.country);
      if (!country) {
        return res.status(400).json({
          success: false,
          message: 'Invalid country ID'
        });
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug color')
     .populate('country', 'name code flag');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
});

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Update category and country job counts
    await Promise.all([
      Category.findByIdAndUpdate(job.category, { $inc: { jobCount: -1 } }),
      Country.findByIdAndUpdate(job.country, { $inc: { jobCount: -1 } })
    ]);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
});

// GET /api/jobs/stats/overview - Get job statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalJobs, activeJobs, totalCategories, totalCountries] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Country.countDocuments({ isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        inactiveJobs: totalJobs - activeJobs,
        totalCategories,
        totalCountries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;