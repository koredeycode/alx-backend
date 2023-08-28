import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) =>
  console.log('Redis client not connected to the server:', err.toString()),
);

client.on('ready', () => console.log('Redis client connected to the server'));

const data = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

Object.entries(data).forEach(([key, value]) => {
  client.HSET('HolbertonSchools', key, value, print);
});
client.HGETALL('HolbertonSchools', (err, reply) => console.log(reply));
