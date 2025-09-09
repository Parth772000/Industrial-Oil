const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, mobile, message } = req.body;

  // Validate required fields
  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate message length
  if (message.length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters long' });
  }

  // Check environment variables
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return res.status(500).json({ message: 'Email service not configured' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send notification email to you
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `🛢️ New Inquiry from ${name} - Industrial Lubricants`,
      html: `
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
          <h2 style='color: #16a34a;'>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href='mailto:${email}'>${email}</a></p>
          <p><strong>Mobile:</strong> <a href='tel:${mobile}'>${mobile}</a></p>
          <p><strong>Message:</strong></p>
          <div style='background: #f3f4f6; padding: 15px; border-radius: 8px;'>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
        </div>
      `
    });

    // Send auto-reply to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank You for Your Interest - Industrial Lubricants',
      html: `
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;'>
          <div style='background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h1 style='margin: 0; font-size: 24px;'>🛢️ Industrial Lubricants</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>Powering Industries, Protecting Machines</p>
          </div>
          <div style='background: white; padding: 30px; border-radius: 0 0 10px 10px;'>
            <h2 style='color: #16a34a; margin-top: 0;'>Dear ${name},</h2>
            <p>Thank you for your interest in Industrial Lubricants! We have received your inquiry and will contact you within 24 hours.</p>
            <div style='background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;'>
              <h3 style='color: #16a34a; margin-top: 0;'>What happens next?</h3>
              <ul style='margin: 0; padding-left: 20px;'>
                <li>Our technical experts will review your requirements</li>
                <li>We'll contact you within 24 hours</li>
                <li>We'll provide customized solutions for your needs</li>
              </ul>
            </div>
            <div style='text-align: center; margin-top: 30px;'>
              <p><strong>Industrial Lubricants</strong><br>
              📞 +1 (555) 123-4567 | ✉️ parthsavaj0@gmail.com</p>
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}