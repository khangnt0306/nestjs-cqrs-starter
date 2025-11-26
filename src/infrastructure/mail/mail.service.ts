import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendMailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter?: nodemailer.Transporter;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<string>('MAIL_PORT');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    const secure =
      this.configService.get<string>('MAIL_SECURE') === 'true' ||
      this.configService.get<boolean>('MAIL_SECURE') === true;

    this.defaultFrom =
      this.configService.get<string>('MAIL_FROM') ||
      `"${this.configService.get<string>('MAIL_FROM_NAME') || 'NestJS Starter'}" <no-reply@example.com>`;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure,
        auth: {
          user,
          pass,
        },
      });

      void this.verifyTransporter();
    } else {
      this.logger.warn(
        'Mail configuration is incomplete. Email sending has been disabled.',
      );
    }
  }

  private async verifyTransporter(): Promise<void> {
    if (!this.transporter) {
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.log('Mail transporter connected successfully.');
    } catch (error) {
      this.logger.error(
        `Mail transporter verification failed: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendMail(payload: SendMailPayload): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        `Email to ${payload.to} was skipped because transporter is not configured.`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.defaultFrom,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text ?? payload.html?.replace(/<[^>]+>/g, ''),
      });
      this.logger.log(`Email sent to ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${payload.to}: ${error.message}`,
        error.stack,
      );
    }
  }
}
