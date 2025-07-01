import { Request, Response } from "express";
import { handleControllerError } from "@utils/error-handler";
import { inject, injectable } from "inversify";
import TYPES from "@types/inversify-types";
import AnimalService from "@services/animal/animal-service";
import AuthService from "@services/auth/auth-service";

@injectable()
export default class ProfileController{

  constructor(
    @inject(TYPES.AnimalService) private animalService: AnimalService,
    @inject(TYPES.AuthService) private authService: AuthService
  ){}

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.authService.getUserFromToken(req.cookies.jwt);
      if (!user) {
        res.status(401).json({ error: "Invalid authentication" });
        return;
      }
      
      const profiles = await this.animalService.getCatProfilesByOwner(user);
      res.status(200).json({profiles: profiles});
    } catch (error) {
      handleControllerError(error, res, "Failed to fetch profile");
    }
  }
}