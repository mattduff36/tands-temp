# T&S Bouncy Castle Hire - Coming Soon Website

A professional coming soon website for T&S Bouncy Castle Hire, featuring a working contact form with email notifications.

## Features

- 🎪 Beautiful animated bouncy castle themed design
- 🌈 Harmonious gradient text and backgrounds
- 📱 Fully responsive mobile-friendly layout
- 📧 Working contact form with email notifications
- 🎈 Interactive bouncing emoji animations
- ⚡ Deployed on Vercel with serverless functions

## Setup Instructions

### Environment Variables

To enable the contact form functionality, you need to set up the following environment variables in Vercel:

```
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=where-you-want-to-receive-emails@gmail.com
```

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Generate an App Password for "Mail"
   - Use this password as `SMTP_PASS`

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add the environment variables in your Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all three variables listed above
3. Deploy or redeploy your site

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your environment variables:
   ```
   SMTP_USER=your-gmail-address@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=where-you-want-to-receive-emails@gmail.com
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Contact Form

The contact form includes:
- Name (required)
- Email (required)
- Phone number (optional)
- Event date (optional)
- Message (required)

When submitted, it sends a beautifully formatted email to the specified contact email address.

## Development

Website developed by [mpdee.co.uk](https://mpdee.co.uk)

## License

MIT License - feel free to use and modify as needed. 