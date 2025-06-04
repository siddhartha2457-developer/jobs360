import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import jobRoutes from './routes/jobs.js';
import categoryRoutes from './routes/categories.js';
import countryRoutes from './routes/countries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected Successfully');

    // ✅ Import routes after DB connects
    const jobRoutes = (await import('./routes/jobs.js')).default;
    const categoryRoutes = (await import('./routes/categories.js')).default;
    const countryRoutes = (await import('./routes/countries.js')).default;

    // ✅ Now use them
    app.use('/api/jobs', jobRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/countries', countryRoutes);

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();


// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/countries', countryRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Job 360 API is running successfully!', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Job 360 Server running on port ${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
});

export default app;