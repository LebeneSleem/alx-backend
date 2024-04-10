// Import necessary libraries
import kue from 'kue';

// Define blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Define function to send notification
function sendNotification(phoneNumber, message, job, done) {
  // Track progress of the job
  job.progress(0, 100);

  // Check if phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return done();
  }

  // Track progress to 50%
  job.progress(50, 100);

  // Log sending notification to console
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Complete the job
  done();
}

// Create a Kue queue to process jobs
const queue = kue.createQueue({ concurrency: 2 });

// Process jobs in the queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
