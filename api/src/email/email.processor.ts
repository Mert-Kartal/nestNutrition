import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailService } from './send-email.service';
import { EmailJobData } from './email.dto';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly sendEmailService: SendEmailService) {
    super();
  }
  async process(job: Job<EmailJobData>) {
    switch (job.name) {
      case 'send-email':
        await this.sendEmailService.sendEmail(job.data);
        console.log(
          `Email job ${job.id} processed. Email sent to: ${job.data.to}`,
        );
        break;
      default:
        console.warn(
          `[EmailProcessor] Unknown job name: ${job.name}. Job ID: ${job.id}. Skipping.`,
        );
        throw new Error('Invalid job name');
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EmailJobData>, err: Error) {
    console.error(
      `[EmailProcessor] Job ${job.id} of type ${job.name} failed with error:`,
      err,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EmailJobData>) {
    console.log(
      `[EmailProcessor] Job ${job.id} of type ${job.name} completed.`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job<EmailJobData>) {
    console.log(
      `[EmailProcessor] Job ${job.id} of type ${job.name} is now active.`,
    );
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job<EmailJobData>) {
    console.warn(
      `[EmailProcessor] Job ${job.id} of type ${job.name} has stalled.`,
    );
  }
}
