import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProducerService } from './email-producer.service';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [SendEmailService, EmailProducerService, EmailProcessor],
  exports: [EmailProducerService],
})
export class EmailModule {}
