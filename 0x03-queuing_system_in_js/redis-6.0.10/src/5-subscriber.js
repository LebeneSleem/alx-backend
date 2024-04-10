import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Connect to the Redis server
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});

// Subscribe to the 'holberton school channel' channel
client.subscribe('holberton school channel');

// Listen for messages on the subscribed channel
client.on('message', (channel, message) => {
  console.log(`Message received on channel '${channel}': ${message}`);

  // If the message is 'KILL_SERVER', unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
