import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailJobData } from './email.dto';

@Injectable()
export class SendEmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST') as string,
      port: this.configService.get('EMAIL_PORT') as number,
      secure: this.configService.get('EMAIL_SECURE') as boolean,
      auth: {
        user: this.configService.get('EMAIL_USER') as string,
        pass: this.configService.get('EMAIL_PASS') as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async sendEmail(data: EmailJobData) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM') as string,
      to: data.to,
      subject: data.subject,
      html: data.html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw new Error('Email sending failed');
    }
  }
}
