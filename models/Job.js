import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Country is required']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'entry'
  },
  experienceRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },
    unit: {
      type: String,
      enum: ['years', 'months'],
      default: 'years'
    }
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  vacancies: {
    type: Number,
    required: [true, 'Number of vacancies is required'],
    min: [1, 'At least 1 vacancy is required']
  },
  qualifications: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  applicationDeadline: {
    type: Date
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ category: 1, country: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

// Virtual for experience display
jobSchema.virtual('experienceDisplay').get(function() {
  if (this.experienceRange.min === this.experienceRange.max) {
    return `${this.experienceRange.min} ${this.experienceRange.unit}`;
  }
  return `${this.experienceRange.min}-${this.experienceRange.max} ${this.experienceRange.unit}`;
});

// Virtual for salary display
jobSchema.virtual('salaryDisplay').get(function() {
  if (!this.salary.min && !this.salary.max) return 'Negotiable';
  if (this.salary.min && this.salary.max) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()} ${this.salary.period}`;
  }
  if (this.salary.min) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()}+ ${this.salary.period}`;
  }
  return `Up to ${this.salary.currency} ${this.salary.max.toLocaleString()} ${this.salary.period}`;
});

jobSchema.set('toJSON', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;