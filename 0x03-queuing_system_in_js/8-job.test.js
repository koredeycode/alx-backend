import kue from 'kue';
import { expect } from 'chai';

import createPushNotificationsJobs from './8-job.js';

describe('test suite for queue', function () {
  const queue = kue.createQueue({ name: 'push_notification_code_test' });
  before(function () {
    queue.testMode.enter(true);
  });

  // afterEach(function () {});

  after(function () {
    queue.testMode.clear();
    queue.testMode.exit();
  });
  it('should throw an error', function () {
    expect(() => {
      createPushNotificationsJobs({}, queue);
    }).to.throw(Error, 'Jobs is not an array');
  });
  it('should pass all test', function () {
    const list = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
    ];
    createPushNotificationsJobs(list, queue);
    expect(queue.testMode.jobs.length).to.equal(1);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.equal(list[0]);
  });
});
