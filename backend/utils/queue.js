const Queue = require('bull');
const emailQueue = new Queue('email', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});
console.log("queue created");

module.exports = emailQueue;
