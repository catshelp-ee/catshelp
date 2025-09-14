import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { User } from 'types/auth-types';

@injectable()
export default class UserController {
  constructor(
  ) { }

  public async getUserData(req: Request, res: Response): Promise<Response<User | { error: string }>> {
    const user = req.user;
    if (!user) {
      res.status(404);
    }

    return res.json(user);
  }
}
