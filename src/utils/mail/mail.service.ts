import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ApiResponse } from '../common/apiresponse/apiresponse';
import { buildReceiptEmail } from './templates/email-templates';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('APP_PASS');

    if (!emailUser || !emailPass) {
      throw new Error('Email configuration is missing');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection error:', error);
      } else {
        this.logger.log('SMTP server is ready to take messages');
      }
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
        from: 'info@privéestate.com',
        to,
        subject,
        html,
        text: text || '',
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.log(error);
      ApiResponse.error(`Failed to send email to ${to}: ${error.message}`, 500);
    }
  }

  // Helper to send receipt emails using reusable template
  async sendReceiptEmail(options: {
    to: string;
    subject: string;
    title: string;
    message: string;
    buttonText?: string;
    buttonUrl?: string;
    footerText?: string;
  }) {
    const { to, subject, title, message, buttonText, buttonUrl, footerText } =
      options;
    const html = buildReceiptEmail({
      title,
      message,
      buttonText,
      buttonUrl,
      footerText,
    });

    await this.sendMail(to, subject, html);
  }
}

// const htmlTemplate = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Email Verification</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f6f8;
//       margin: 0;
//       padding: 0;
//     }
//     .container {
//       max-width: 500px;
//       margin: 40px auto;
//       background: #ffffff;
//       padding: 30px;
//       border-radius: 12px;
//       box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//       text-align: center;
//     }
//     .logo {
//       font-size: 22px;
//       font-weight: bold;
//       color: #2c3e50;
//       margin-bottom: 20px;
//     }
//     h2 {
//       color: #333;
//       margin-bottom: 10px;
//     }
//     p {
//       color: #555;
//       font-size: 14px;
//     }
//     .otp {
//       font-size: 28px;
//       font-weight: bold;
//       letter-spacing: 4px;
//       background: #f1f5ff;
//       color: #2c3e50;
//       padding: 12px 20px;
//       border-radius: 8px;
//       margin: 20px auto;
//       display: inline-block;
//     }
//     .footer {
//       font-size: 12px;
//       color: #888;
//       margin-top: 30px;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="logo">🔒 {{company}}</div>

//     <p>Use the following One-Time Password (OTP) to verify your email:</p>

//     <div class="otp">{{otp}}</div>

//     <p>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>

//     <div class="footer">
//       This is an automated message, please do not reply.<br>
//       &copy; {{year}} {{company}}. All rights reserved.
//     </div>
//   </div>
// </body>
// </html>
// `;
