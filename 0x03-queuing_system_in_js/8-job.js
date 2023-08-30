import kue from 'kue';

export default function createPushNotificationsJobs(jobs, queue) {
  if (Array.isArray(jobs) === false) {
    throw new Error('Jobs is not an array');
  }
  jobs.forEach((job_data) => {
    const job = queue.create('push_notification_code_3', job_data);
    job
      .on('enqueue', () => {
        console.log(`Notification job created: ${job.id}`);
      })
      .on('complete', () => {
        console.log(`Notification job ${job.id} completed`);
      })
      .on('failed', (err) => {
        console.log(
          `Notification job ${job.id} failed: ${err.message || err.toString()}`,
        );
      })
      .on('progress', (progress, _data) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });
    job.save();
  });
}
