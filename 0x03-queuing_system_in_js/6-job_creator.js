import kue from 'kue';

const queue = kue.createQueue({ name: 'push_notification_code' });

const jobdata = {
  phoneNumber: '+2348123456789',
  message: 'Test message',
};

const job = queue.create('push_notification_code', jobdata);

job
  .on('enqueue', () => {
    console.log(`Notification job created: ${job.id}`);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', (err) => {
    console.log(`Notification job failed`);
  });

job.save();
