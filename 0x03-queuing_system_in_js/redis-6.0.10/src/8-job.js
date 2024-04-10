// Import necessary libraries
import kue from 'kue';

// Define function to create push notifications jobs
function createPushNotificationsJobs(jobs, queue) {
  // Check if jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Create a job for each job object in the array
  jobs.forEach((jobData) => {
    // Create a new job in the queue
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (!err) {
          console.log(`Notification job created: ${job.id}`);
        } else {
          console.error(`Error creating job: ${err}`);
        }
      });

    // Event listeners for job completion, failure, and progress
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.error(`Notification job ${job.id} failed: ${err}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}
