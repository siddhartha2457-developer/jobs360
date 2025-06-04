// controllers/contactController.js
import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  const { full_name, phone_number, email, job_title } = req.body;

  if (!full_name || !phone_number) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  try {
    // Save to MongoDB
    const contact = new Contact({ full_name, phone_number, email, job_title });
    await contact.save();

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password
      },
    });

await transporter.sendMail({
  from: process.env.MAIL_USER,
  to: process.env.RECEIVER_EMAIL,
  subject: `📬 New Inquiry from ${full_name}`,
  text: `
Full Name: ${full_name}
Phone Number: ${phone_number}
Email: ${email || 'N/A'}
Job Title: ${job_title || 'N/A'}
  `,
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #2a9d8f;">New Contact Form Submission</h2>
      <table cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td><strong>Full Name:</strong></td>
          <td>${full_name}</td>
        </tr>
        <tr>
          <td><strong>Phone Number:</strong></td>
          <td>${phone_number}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>${email || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Job Title:</strong></td>
          <td>${job_title || 'N/A'}</td>
        </tr>
      </table>
      <br/>
      <p style="font-size: 14px; color: #555;">You received this message from your website contact form.</p>
    </div>
  `,
  replyTo: email
});

    res.status(200).json({ message: "Form submitted and email sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
