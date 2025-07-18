import { Animal, AnimalRescue } from 'generated/prisma';

export interface CreateAnimalData {
  state: string;
  location: string;
  notes?: string;
  rankNr?: string;
}

export interface CreateAnimalResult {
  animal: Animal;
  animalRescue: AnimalRescue;
}

export interface Pet {
  name: string;
  pathToImage: string;
}
