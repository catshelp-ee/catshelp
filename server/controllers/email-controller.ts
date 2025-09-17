import EmailService from '@services/auth/email-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class EmailController {
  constructor(
    @inject(TYPES.EmailService)
    private emailService: EmailService
  ) { }

  public async sendNotification(req: Request, res: Response) {
    const images = req.files as Express.Multer.File[];
    const data = req.body;

    await this.emailService.sendEmail(
      images,
      data,
    );
    return res.sendStatus(200);
  }
}
