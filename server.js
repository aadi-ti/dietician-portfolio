const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-confirmation', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use SMTP config for production
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Your Wellness Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to your personalized wellness journey!",
      html: `
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for filling out the intake form. Click below to schedule your consultation:</p>
        <a href="https://calendly.com/nirmala-joshi30/30min">Book your consultation slot</a>
        <p>Best regards,<br>Your Wellness Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
