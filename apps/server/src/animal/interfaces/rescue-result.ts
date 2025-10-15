import { Animal } from "../entities/animal.entity";
import { Rescue } from "../entities/rescue.entity";

export interface RescueResult {
    animal: Animal;
    rescue: Rescue;
}
