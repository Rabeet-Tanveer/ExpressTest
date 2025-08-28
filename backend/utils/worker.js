require('dotenv').config();
const emailQueue = require('../utils/queue');
const sendEmail = require('../utils/mailer');

console.log("Worker started...");
emailQueue.process('email',async (job) => {
  const { to, subject, text, html } = job.data;
  console.log("before sending mail");
  try {
    await sendEmail({ to, subject, text, html });
    console.log("after sending mail");
  } catch (err) {
    console.error("Error sending mail:", err);
  }
});