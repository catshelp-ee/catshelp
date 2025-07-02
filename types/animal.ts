import { Animal, AnimalRescue } from "generated/prisma";

export interface CreateAnimalData {
  state: string;
  location: string;
  notes?: string;
}

export interface CreateAnimalResult {
  animal: Animal;
  animalRescue: AnimalRescue;
}