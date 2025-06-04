import express from 'express';
import Country from '../models/Country.js';

const router = express.Router();

// GET /api/countries - Get all countries
router.get('/', async (req, res) => {
  try {
    const { isActive = true, includeJobCount = false } = req.query;
    
    const filter = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    let query = Country.find(filter).sort({ name: 1 });
    
    if (includeJobCount === 'true') {
      // Aggregate to get actual job count
      const countries = await Country.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: 'country',
            as: 'jobs'
          }
        },
        {
          $addFields: {
            actualJobCount: { $size: '$jobs' }
          }
        },
        {
          $project: {
            jobs: 0
          }
        },
        { $sort: { name: 1 } }
      ]);
      
      return res.json({
        success: true,
        data: countries
      });
    }

    const countries = await query;

    res.json({
      success: true,
      data: countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message
    });
  }
});

// GET /api/countries/:id - Get single country
router.get('/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    res.json({
      success: true,
      data: country
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching country',
      error: error.message
    });
  }
});

// POST /api/countries - Create new country
router.post('/', async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();

    res.status(201).json({
      success: true,
      message: 'Country created successfully',
      data: country
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Country name or code already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating country',
      error: error.message
    });
  }
});

// PUT /api/countries/:id - Update country
router.put('/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    res.json({
      success: true,
      message: 'Country updated successfully',
      data: country
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Country name or code already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating country',
      error: error.message
    });
  }
});

// DELETE /api/countries/:id - Delete country
router.delete('/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    // Check if country has associated jobs
    const Job = (await import('../models/Job.js')).default;
    const jobCount = await Job.countDocuments({ country: req.params.id });
    
    if (jobCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete country. It has ${jobCount} associated jobs.`
      });
    }

    await Country.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Country deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting country',
      error: error.message
    });
  }
});

export default router;