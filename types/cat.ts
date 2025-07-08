export interface Descriptors {
  coatColour: string;
  coatLength: string;
  gender: string;
  cut: string;
  procedures: string;
  duration: string;
  appearance: string;
  issues: string;
  history: string;
  characteristics: string[];
  likes: string[];
  cat: string[];
  descriptionOfCharacter: string;
  treatOtherCats: string;
  treatDogs: string;
  treatChildren: string;
  outdoorsIndoors: string;
  other: string;
  wishes: string;
}

export const descriptors: Descriptors = {
  duration: '',
  gender: '',
  coatColour: '',
  coatLength: '',
  cut: 'false',
  appearance: '',
  issues: '',
  history: '',
  procedures: '',
  characteristics: [],
  likes: [],
  cat: [],
  descriptionOfCharacter: '',
  treatOtherCats: '',
  treatDogs: '',
  treatChildren: '',
  outdoorsIndoors: '',
  other: '',
  wishes: '',
};

export interface Cat extends Descriptors {
  title: string;
  description: string;
  name: string;
  birthDate: Date | null;
  chipNr: string;
  llr: boolean;
  genderLabel: string;
  wormMedName: string;
  wormMedDate: Date | null;
  rescueDate: Date | null;
  foundLoc: string;
  age: string;
  currentLoc: string;
  vaccDate: Date | null;
  vaccEndDate: Date | null;
  rabiesVaccDate: Date | null;
  rabiesVaccEndDate: Date | null;
  images: string[];
  rowIndex: number;
  driveId: string;
}

export interface formFields {
  id: string;
  name: string;
  birthDate: Date;
  foundLoc: string;
  foundDate: Date;
  gender: string;
  coatLength: string;
  coatColour: string;
  chipNr: string;
  llr: boolean;
  vaccDate: Date | null;
  vaccEndDate: Date | null;
  rabiesVaccDate: Date | null;
  rabiesVaccEndDate: Date | null;
  wormMedName: string;
  wormMedDate: Date | null;
  issues: string;
  duration: string;
  history: string;
  characteristics: string[];
  likes: string[];
  cat: string[]; // nt Kasutab kratsimispuud hästi
  descriptionOfCharacter: string;
  treatOtherCats: string;
  treatDogs: string;
  treatChildren: string;
  outdoorsIndoors: string;
  wishes: string;
  other: string;
  cut: string;
}

export const defaultCat: Cat = {
  ...descriptors,
  title: '',
  description: '',
  name: '',
  birthDate: null,
  currentLoc: '',
  age: '',
  chipNr: '',
  llr: false,
  genderLabel: '',
  wormMedName: '',
  wormMedDate: null,
  rescueDate: null,
  foundLoc: '',
  vaccDate: null,
  vaccEndDate: null,
  rabiesVaccDate: null,
  rabiesVaccEndDate: null,
  images: [],
  other: '',
  wishes: '',
  driveId: '',
};

export interface CharacteristicsResult {
  character: string[];
  likes: string[];
  cat: string[];
  others: Record<string, string>;
}
