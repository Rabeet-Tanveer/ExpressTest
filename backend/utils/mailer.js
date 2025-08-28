const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // or 587
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transport error:', error);
  } else {
    console.log('Server is ready to send emails!');
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  };

  console.log("Sending mail with options:", mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
};

module.exports = sendEmail;
