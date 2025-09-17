import AnimalService from '@services/animal/animal-service';
import EmailService from '@services/auth/email-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class EmailController {
  constructor(
    @inject(TYPES.EmailService)
    private emailService: EmailService,
    @inject(TYPES.AnimalService)
    private animalService: AnimalService
  ) { }

  public async sendNotification(req: Request, res: Response) {
    const images = req.files as Express.Multer.File[];
    const data = req.body;

    const mailList = JSON.parse(data.to);
    const subject = data.subject;

    const animal = await this.animalService.getAnimalById(data.animalId);

    const html = `
    <main>
      <h1>Pealkiri: ${data.title}</h1>
      <h2>Looma kirjeldus: ${data.description}</h2>
      <h3>Looma järjekorranumber: ${animal.animalsToRescue.at(animal.animalsToRescue.length - 1).animalRescue.rankNr}</h3>
    </main>
    `;

    const attachments = images.map(image => {
      return {
        filename: image.filename,
        path: image.path,
      };
    });

    await this.emailService.sendEmail(
      html,
      subject,
      mailList,
      attachments
    );
    return res.sendStatus(200);
  }
}
