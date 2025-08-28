const express = require('express');
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const emailQueue = require('./utils/queue'); // adjust if needed

const app = express();

// Adapter setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Bull Board setup
createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

// Mount the router
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3001, () => {
  console.log('Bull Board running at http://localhost:3001/admin/queues');
});
