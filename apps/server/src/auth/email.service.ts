import { AnimalService } from '@animal/animal.service';
import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
    transporter;

    constructor(
        //Animal pole kuidagi meili saatmisega seotud. See service peaks olema mujal.
        private readonly animalService: AnimalService
    ) {
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


    public async sendNotificationToVolunteers(images: Express.Multer.File[], data: any) {
        const mailList = JSON.parse(data.to);
        const subject = data.subject;

        const animal = await this.animalService.getAnimalById(data.animalId);

        const html = `
    <main>
      <h1>Pealkiri: ${data.title}</h1>
      <h2>Looma kirjeldus: ${data.description}</h2>
      <h3>Looma järjekorranumber: ${animal!.animalRescue.rankNr}</h3>
    </main>
    `;

        const attachments = images.map(image => {
            return {
                filename: image.filename,
                path: image.path,
            };
        });

        this.sendEmail(html, subject, mailList, attachments)
    }

    public sendNotificationToUser(
        html: string,
        subject: string,
        to: string[],
        attachments?: { filename: string; path: string, cid?: string }[]
    ) {
        this.sendEmail(html, subject, to, attachments);
    }

    private sendEmail(
        html: string,
        subject: string,
        to: string[],
        attachments?: { filename: string; path: string, cid?: string }[]
    ) {
        return this.transporter.sendMail({
            from: process.env.MAGIC_LINK_SENDER,
            to,
            subject,
            html,
            attachments,
        });
    }

    public async sendRequest(id: number, email: string) {
        const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
            expiresIn: '10m',
        });
        await this.sendMagicLink(email, token);
    }

    public sendMagicLink(email: string, token: string) {
        return this.transporter.sendMail({
            from: process.env.MAGIC_LINK_SENDER,
            to: email,
            subject: '🐈 Cats Help Sisselogimine',
            html: `<a href="${process.env.VITE_FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
        });
    }
}
