const emailQueue = require('./utils/queue');

emailQueue.add('email', {
  to: 'someone@example.com',
  subject: 'Test',
  text: 'Test',
  html: '<b>Test</b>'
});

console.log("task made")