// Import necessary libraries
import kue from 'kue';
import createPushNotificationsJobs from './8-job';

// Initialize the queue in test mode
const queue = kue.createQueue({ redis: { port: 6379, host: '127.0.0.1', db: 3 }, prefix: 'test' });

// Describe test suite for createPushNotificationsJobs function
describe('createPushNotificationsJobs function', () => {
  // Set up before each test
  beforeEach(() => {
    // Enter test mode
    queue.testMode.enter();
  });

  // Tear down after each test
  afterEach(() => {
    // Clear the queue and exit test mode
    queue.testMode.clear();
    queue.testMode.exit();
  });

  // Test case for createPushNotificationsJobs with valid jobs array
  it('should create jobs in the queue', () => {
    // Define test jobs
    const jobs = [{ phoneNumber: '1234567890', message: 'Test message 1' }, { phoneNumber: '0987654321', message: 'Test message 2' }];

    // Call the function to create jobs
    createPushNotificationsJobs(jobs, queue);

    // Expect two jobs to be created in the queue
    expect(queue.testMode.jobs.length).toBe(2);

    // Check if jobs are created with correct data
    expect(queue.testMode.jobs[0].type).toBe('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).toEqual(jobs[0]);

    expect(queue.testMode.jobs[1].type).toBe('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).toEqual(jobs[1]);
  });

  // Test case for createPushNotificationsJobs with invalid jobs argument
  it('should throw error for invalid jobs argument', () => {
    // Define invalid jobs argument
    const invalidJobs = 'invalid';

    // Expect function to throw an error
    expect(() => {
      createPushNotificationsJobs(invalidJobs, queue);
    }).toThrowError('Jobs is not an array');
  });
});
