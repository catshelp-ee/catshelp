import UserRepository from '@repositories/user-repository';
import AuthService from '@services/auth/auth-service';
import UserService from '@services/user/user-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { User } from 'types/auth-types';
import TYPES from 'types/inversify-types';

@injectable()
export default class UserController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async getUserData(
    req: Request,
    res: Response
  ): Promise<Response<User | { error: string }>> {
    try {
      const token = req.cookies?.jwt;

      if (!token) {
        return res
          .status(401)
          .json({ error: 'No authentication token provided' });
      }

      const decodedToken = this.authService.verifyJWT(token);
      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const user = await this.userRepository.getUserById(
        Number(decodedToken.id)
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Get user data error:', error);

      // Handle specific JWT errors
      if (error instanceof Error) {
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
