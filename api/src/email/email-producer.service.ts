import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EmailJobData } from './email.dto';

@Injectable()
export class EmailProducerService {
  constructor(
    @InjectQueue('email-queue') private readonly queue: Queue<EmailJobData>,
  ) {}
  async addEmailJob(data: EmailJobData) {
    await this.queue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
