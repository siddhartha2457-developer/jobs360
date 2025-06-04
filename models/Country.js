import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Country name cannot exceed 100 characters']
  },
  code: {
    type: String,
    
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [2, 'Country code must be at least 2 characters'],
    maxlength: [3, 'Country code cannot exceed 3 characters']
  },
  flag: {
    type: String,
    trim: true
  },
  currency: {
    code: {
      type: String,
      uppercase: true,
      trim: true
    },
    symbol: {
      type: String,
      trim: true
    }
  },
  timezone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  jobCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
countrySchema.index({ isActive: 1, name: 1 });

const Country = mongoose.model('Country', countrySchema);

export default Country;