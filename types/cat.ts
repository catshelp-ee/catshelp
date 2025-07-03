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
  duration: "",
  gender: "",
  coatColour: "",
  coatLength: "",
  cut: "false",
  appearance: "",
  issues: "",
  history: "",
  procedures: "",
  characteristics: [],
  likes: [],
  cat: [],
  descriptionOfCharacter: "",
  treatOtherCats: "",
  treatDogs: "",
  treatChildren: "",
  outdoorsIndoors: "",
  other: "",
  wishes: "",
};

export interface Cat extends Descriptors {
  title: string;
  description: string;
  name: string;
  birthDate: Date | null ;
  chipNr: string;
  llr: boolean;
  genderLabel: string;
  wormMedName: string;
  wormMedDate: Date | null ;
  rescueDate: Date | null ;
  foundLoc: string;
  age: string;
  currentLoc: string;
  vaccDate: Date | null ;
  vaccEndDate: Date | null ;
  rabiesVaccDate: Date | null ;
  rabiesVaccEndDate: Date | null ;
  images: string[];
  driveId: string;
}

export const defaultCat: Cat = {
  ...descriptors,
  title: "",
  description: "",
  name: "",
  birthDate: null,
  currentLoc: "",
  age: "",
  chipNr: "",
  llr: false,
  genderLabel: "",
  wormMedName: "",
  wormMedDate: null,
  rescueDate: null,
  foundLoc: "",
  vaccDate: null,
  vaccEndDate: null,
  rabiesVaccDate: null,
  rabiesVaccEndDate: null,
  images: [],
  other: "",
  wishes: "",
  driveId: "",
};

export interface CharacteristicsResult {
  character: string[];
  likes: string[];
  cat: string[];
  others: Record<string, string>;
}