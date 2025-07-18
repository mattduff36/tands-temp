const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    console.log('Contact form submission received:', req.method);
    console.log('Request body:', req.body);
    
    const { name, email, phone, eventDate, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        console.log('Validation failed: missing required fields');
        return res.status(400).json({ message: 'Please fill in all required fields!' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address!' });
    }

    try {
        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL,
            subject: 'New Enquiry from T&S Bouncy Castle Hire Website',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #ff6b6b; text-align: center;">🎪 New Bouncy Castle Enquiry! 🎪</h2>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
                    </div>
                    
                    <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <hr style="margin: 20px 0;">
                    
                    <p style="text-align: center; color: #666; font-size: 12px;">
                        This enquiry was submitted via the T&S Bouncy Castle Hire website.<br>
                        Website developed by mpdee.co.uk
                    </p>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: '🎉 Thank you for your enquiry! We\'ll bounce back to you within 24 hours!' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            message: 'Sorry, there was an error sending your message. Please try calling us directly at 07835 094187.' 
        });
    }
} 