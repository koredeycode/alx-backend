import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';
import express from 'express';

const app = express();
const client = redis.createClient();
const queue = kue.createQueue({ name: 'reserve_seat' });

const numberOfSeats = 50;
let reservationEnabled = true;

function reserveSeat(number) {
  client.set('available_seats', number);
}

function getCurrentAvailableSeats() {
  return promisify(client.get).bind(client)('available_seats');
}

app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  try {
    const job = queue.create('reserve_seat');
    job
      .on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err}`);
      });
    job.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', async (job, done) => {
    let numberOfAvailableSeats = Number(
      (await getCurrentAvailableSeats()) || 0,
    );
    numberOfAvailableSeats -= 1;
    if (numberOfAvailableSeats === 0) {
      reservationEnabled = false;
    }
    if (numberOfAvailableSeats < 0) {
      done(Error('Not enough seats available'));
      return;
    }
    reserveSeat(numberOfAvailableSeats);
    done();
  });
});

app.listen(1245, () => {
  reserveSeat(numberOfSeats);
  console.log('API available on localhost port 1245');
});
