import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class FileUploadProducerService {
  constructor(
    @InjectQueue('file-upload-queue') private readonly queue: Queue,
  ) {}
  async removeFileUploadJob(data: string[]) {
    await this.queue.add('remove-file-upload', data, {
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
