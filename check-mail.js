require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('VERIFY_ERROR:', error.message);
    console.error('CODE:', error.code || 'none');
    console.error('COMMAND:', error.command || 'none');
    process.exit(1);
  }

  console.log('SMTP verify success:', success);
});
