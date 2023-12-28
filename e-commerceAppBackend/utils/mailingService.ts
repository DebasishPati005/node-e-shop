import { Transporter, createTransport, createTestAccount } from 'nodemailer';
import { MailConfig, MailResponse } from '../src/types';
import { RESPONSE_MESSAGE } from '../src/common/constants';

export class MailService {
  transporter!: Transporter;
  private static instance?: MailService;

  private constructor() {
    this.createConnection();
  }

  static getMailServiceInstance(): MailService {
    if (!this.instance) {
      return new MailService();
    } else {
      return this.instance;
    }
  }

  private createConnection(): void {
    this.transporter = createTransport({
      host: process.env.GOOGLE_SES_HOST,
      port: +process.env.GOOGLE_SES_PORT!,
      secure: process.env.GOOGLE_SES_SECURE?.toLowerCase() === 'true',
      service: process.env.GOOGLE_SES_SERVICE!,
      auth: {
        user: process.env.GOOGLE_SES_USER!,
        pass: process.env.GOOGLE_SES_PASSWORD!,
      },
    });
  }

  public async sentMail(mailConfig: MailConfig): Promise<MailResponse> {
    try {
      await this.transporter.sendMail({
        from: process.env.GOOGLE_SES_USER,
        ...mailConfig,
      });

      return {
        message: RESPONSE_MESSAGE.mailSendSuccessMessage,
        sentMail: true,
      };
    } catch {
      return { message: RESPONSE_MESSAGE.mailSendSuccessMessage, sentMail: true };
    }
  }
}
