// models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String },
    job_title: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
