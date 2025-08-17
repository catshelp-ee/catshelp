import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

export default class EmailService {
  transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendRequest(id: number, email: string) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: '10m',
    });
    await this.sendMagicLink(email, token);
  }

  sendMagicLink(email: string, token: string) {
    return this.transporter.sendMail({
      from: process.env.MAGIC_LINK_FROM_EMAIL,
      to: email,
      subject: '🐈 Cats Help Sisselogimine',
      html: `<a href="${process.env.VITE_FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
    });
  }
}
