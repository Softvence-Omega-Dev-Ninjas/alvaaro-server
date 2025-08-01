import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // ✅ Can later change to SMTP or SendGrid easily
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('APP_PASS'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('EMAIL_FROM') || 'Alvaro'}" <${this.configService.get<string>('EMAIL_FROM')}>`,
        to,
        subject,
        html,
        text: text || '',
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new Error('Email could not be sent. Please try again later.');
    }
  }
}
