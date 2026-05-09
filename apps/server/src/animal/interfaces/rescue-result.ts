import type { Animal } from '../entities/animal.entity';
import type { Rescue } from '../entities/rescue.entity';

export interface RescueResult {
    animal: Animal;
    rescue: Rescue;
}
