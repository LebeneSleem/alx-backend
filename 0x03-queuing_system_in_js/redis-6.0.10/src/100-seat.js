const express = require('express');
const redis = require('redis');
const kue = require('kue');
const { promisify } = require('util');

const app = express();
const port = 1245;

const client = redis.createClient();
const queue = kue.createQueue();

const reserveSeat = async (number) => {
  const setAsync = promisify(client.set).bind(client);
  await setAsync('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  const getAsync = promisify(client.get).bind(client);
  const seats = await getAsync('available_seats');
  return parseInt(seats);
};

const reserveSeatJob = async () => {
  return new Promise((resolve, reject) => {
    if (!reservationEnabled) {
      resolve({ status: 'Reservation are blocked' });
    } else {
      const job = queue.create('reserve_seat').save((err) => {
        if (err) {
          reject({ status: 'Reservation failed' });
        } else {
          resolve({ status: 'Reservation in process' });
        }
      });
    }
  });
};

const processQueue = async () => {
  const seats = await getCurrentAvailableSeats();
  if (seats === 0) {
    reservationEnabled = false;
  }
  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();
    if (currentSeats <= 0) {
      done(new Error('Not enough seats available'));
    } else {
      await reserveSeat(currentSeats - 1);
      if (currentSeats === 1) {
        reservationEnabled = false;
      }
      done();
    }
  });
};

let reservationEnabled = true;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  reserveSeat(50);
  processQueue();
});

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

app.get('/reserve_seat', async (req, res) => {
  const result = await reserveSeatJob();
  res.json(result);
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
});

queue.on('job complete', (id) => {
  console.log(`Seat reservation job ${id} completed`);
});

queue.on('job failed', (id, err) => {
  console.log(`Seat reservation job ${id} failed: ${err}`);
});
