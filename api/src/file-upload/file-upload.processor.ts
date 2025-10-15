import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FileUploadService } from './file-upload.service';

@Processor('file-upload-queue')
export class FileUploadProcessor extends WorkerHost {
  constructor(private readonly fileUploadService: FileUploadService) {
    super();
  }
  async process(job: Job<string[]>) {
    switch (job.name) {
      case 'remove-file-upload':
        await this.fileUploadService.deleteFiles(job.data);
        console.log(
          `File upload job ${job.id} processed. Files deleted: ${job.data.join(', ')}`,
        );
        break;
      default:
        console.warn(
          `[FileUploadProcessor] Unknown job name: ${job.name}. Job ID: ${job.id}. Skipping.`,
        );
        throw new Error('Invalid job name');
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(
      `[EmailProcessor] Job ${job.id} of type ${job.name} failed with error:`,
      err,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(
      `[EmailProcessor] Job ${job.id} of type ${job.name} completed.`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(
      `[EmailProcessor] Job ${job.id} of type ${job.name} is now active.`,
    );
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    console.warn(
      `[EmailProcessor] Job ${job.id} of type ${job.name} has stalled.`,
    );
  }
}
