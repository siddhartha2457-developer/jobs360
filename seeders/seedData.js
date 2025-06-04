import mongoose from 'mongoose';
import Category from '../../models/Category.js';
import Country from '../models/Country.js';
import Job from '../models/Job.js';

// Sample categories
const categories = [
  {
    name: 'Healthcare',
    description: 'Medical and healthcare related positions',
    icon: '🏥',
    color: '#10B981'
  },
  {
    name: 'Technology',
    description: 'Software development and IT positions',
    icon: '💻',
    color: '#3B82F6'
  },
  {
    name: 'Finance',
    description: 'Banking, accounting and financial services',
    icon: '💰',
    color: '#F59E0B'
  },
  {
    name: 'Education',
    description: 'Teaching and educational positions',
    icon: '📚',
    color: '#8B5CF6'
  },
  {
    name: 'Marketing',
    description: 'Marketing and advertising roles',
    icon: '📈',
    color: '#EF4444'
  },
  {
    name: 'Engineering',
    description: 'Engineering and technical positions',
    icon: '⚙️',
    color: '#6B7280'
  }
];

// Sample countries
const countries = [
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    currency: { code: 'SAR', symbol: 'ر.س' },
    timezone: 'Asia/Riyadh'
  },
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currency: { code: 'USD', symbol: '$' },
    timezone: 'America/New_York'
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    currency: { code: 'GBP', symbol: '£' },
    timezone: 'Europe/London'
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    currency: { code: 'CAD', symbol: 'C$' },
    timezone: 'America/Toronto'
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    currency: { code: 'AUD', symbol: 'A$' },
    timezone: 'Australia/Sydney'
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    currency: { code: 'EUR', symbol: '€' },
    timezone: 'Europe/Berlin'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job360');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Job.deleteMany({}),
      Category.deleteMany({}),
      Country.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert countries
    const insertedCountries = await Country.insertMany(countries);
    console.log(`✅ Inserted ${insertedCountries.length} countries`);

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Ward Boys Needed for King Fahd Medical City',
        company: 'Saudi Arabia Hospitals',
        description: 'We are looking for dedicated ward boys to join our team at King Fahd Medical City. The ideal candidate will assist nursing staff and ensure patient comfort.',
        requirements: 'High school diploma or equivalent, previous hospital experience preferred, good communication skills, physical fitness required.',
        category: insertedCategories.find(c => c.name === 'Healthcare')._id,
        country: insertedCountries.find(c => c.name === 'Saudi Arabia')._id,
        location: {
          city: 'Riyadh',
          state: 'Riyadh Province',
          address: 'King Fahd Medical City, Riyadh'
        },
        jobType: 'full-time',
        experienceLevel: 'entry',
        experienceRange: { min: 1, max: 3, unit: 'years' },
        salary: { min: 25000, max: 35000, currency: 'SAR', period: 'yearly' },
        vacancies: 20,
        qualifications: ['10th Pass / Experience Preferred', 'Physical fitness required'],
        skills: ['Patient care', 'Communication', 'Teamwork'],
        benefits: ['Health insurance', 'Annual leave', 'Training provided'],
        contactEmail: 'hr@saudihospitals.com',
        contactPhone: '+966-11-123-4567',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Senior Software Engineer',
        company: 'Tech Solutions Inc',
        description: 'Join our dynamic team as a Senior Software Engineer. You will be responsible for developing scalable web applications and mentoring junior developers.',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience in software development, proficiency in React, Node.js, and MongoDB.',
        category: insertedCategories.find(c => c.name === 'Technology')._id,
        country: insertedCountries.find(c => c.name === 'United States')._id,
        location: {
          city: 'San Francisco',
          state: 'California',
          address: 'Tech Hub, San Francisco'
        },
        jobType: 'full-time',
        experienceLevel: 'senior',
        experienceRange: { min: 5, max: 8, unit: 'years' },
        salary: { min: 120000, max: 150000, currency: 'USD', period: 'yearly' },
        vacancies: 3,
        qualifications: ['Bachelor\'s degree in Computer Science', '5+ years experience'],
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
        benefits: ['Health insurance', 'Stock options', 'Remote work', '401k'],
        contactEmail: 'careers@techsolutions.com',
        contactPhone: '+1-555-123-4567',
        isActive: true,
        isFeatured: false
      },
      {
        title: 'Marketing Manager',
        company: 'Global Marketing Agency',
        description: 'We are seeking an experienced Marketing Manager to lead our digital marketing campaigns and drive brand growth.',
        requirements: 'MBA in Marketing preferred, 3+ years of marketing experience, expertise in digital marketing strategies.',
        category: insertedCategories.find(c => c.name === 'Marketing')._id,
        country: insertedCountries.find(c => c.name === 'United Kingdom')._id,
        location: {
          city: 'London',
          state: 'England',
          address: 'Marketing District, London'
        },
        jobType: 'full-time',
        experienceLevel: 'mid',
        experienceRange: { min: 3, max: 5, unit: 'years' },
        salary: { min: 45000, max: 60000, currency: 'GBP', period: 'yearly' },
        vacancies: 2,
        qualifications: ['MBA in Marketing preferred', '3+ years experience'],
        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
        benefits: ['Health insurance', 'Pension scheme', 'Flexible hours'],
        contactEmail: 'hr@globalmarketing.co.uk',
        contactPhone: '+44-20-1234-5678',
        isActive: true,
        isFeatured: false
      }
    ];

    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${insertedJobs.length} sample jobs`);

    // Update category and country job counts
    for (const category of insertedCategories) {
      const jobCount = await Job.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { jobCount });
    }

    for (const country of insertedCountries) {
      const jobCount = await Job.countDocuments({ country: country._id });
      await Country.findByIdAndUpdate(country._id, { jobCount });
    }

    console.log('✅ Updated job counts for categories and countries');
    console.log('🎉 Database seeding completed successfully!');

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Countries: ${insertedCountries.length}`);
    console.log(`Jobs: ${insertedJobs.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;