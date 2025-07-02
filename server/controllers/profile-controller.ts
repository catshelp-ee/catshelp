import { Request, Response } from "express";
import { handleControllerError } from "@utils/error-handler";
import { inject, injectable } from "inversify";
import TYPES from "types/inversify-types";
import AuthService from "@services/auth/auth-service";
import ProfileService from "@services/profile/profile-service";
import UserService from "@services/user/user-service";

@injectable()
export default class ProfileController{

  constructor(
    @inject(TYPES.ProfileService) private profileService: ProfileService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.AuthService) private authService: AuthService

  ){}

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
      const user = await this.userService.getUser(decodedToken.id);
      if (!user) {
        res.status(401).json({ error: "Invalid authentication" });
        return;
      }
      
      const profiles = await this.profileService.getCatProfilesByOwner(user);
      res.status(200).json({profiles: profiles});
    } catch (error) {
      handleControllerError(error, res, "Failed to fetch profile");
    }
  }
}
