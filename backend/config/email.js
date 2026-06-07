import nodemailer from 'nodemailer';

let transporter;

// Only initialize email if credentials are configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && !process.env.EMAIL_USER.includes('your_email')) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Dev mode: mock transporter
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('[DEV MODE] Email would be sent:');
      console.log('  To:', mailOptions.to);
      console.log('  Subject:', mailOptions.subject);
      console.log('  HTML:', mailOptions.html.substring(0, 100) + '...');
      return Promise.resolve();
    },
  };
}

export { transporter };

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@pizzadelivery.com',
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw in dev mode, just log
    if (process.env.NODE_ENV !== 'development') {
      throw error;
    }
  }
};
