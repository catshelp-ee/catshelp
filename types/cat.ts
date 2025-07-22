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

export interface CharacteristicsResult {
  multiSelectArrays: Record<keyof MultiselectFields, string[]>;
  others: Record<keyof SelectFields | keyof TextFields, string>;
}

export interface Profile {
  title: string;
  description: string;
  profilePicture: string;
  images: string[];
  mainInfo: MainInfo;
  vaccineInfo: VaccineInfo;
  animalRescueInfo: AnimalRescueInfo;
  characteristics: CharacteristicsInfo;
}

export function createProfile(): Profile {
  return {
    title: '',
    description: '',
    profilePicture: '',
    images: [],
    mainInfo: createMainInfo(),
    vaccineInfo: createVaccineInfo(),
    animalRescueInfo: createAnimalRescueInfo(),
    characteristics: createCharacteristicsInfo(),
  };
}

interface MainInfo {
  name: string;
  birthDate: Date | null;
  microchip: string;
  microchipRegisteredInLLR: boolean;
  location: string;
}

function createMainInfo(): MainInfo {
  return {
    name: '',
    birthDate: null,
    microchip: '',
    microchipRegisteredInLLR: false,
    location: '',
  };
}

interface VaccineInfo {
  complexVaccine: Date | null;
  nextComplexVaccineDate: Date | null;
  rabiesVaccine: Date | null;
  nextRabiesVaccineDate: Date | null;
  dewormingOrFleaTreatmentDate: Date | null;
  dewormingOrFleaTreatmentName: string;
}

function createVaccineInfo(): VaccineInfo {
  return {
    complexVaccine: null,
    nextComplexVaccineDate: null,
    rabiesVaccine: null,
    nextRabiesVaccineDate: null,
    dewormingOrFleaTreatmentDate: null,
    dewormingOrFleaTreatmentName: '',
  };
}

interface AnimalRescueInfo {
  rescueLocation: string;
  rescueDate: Date | null;
}

function createAnimalRescueInfo(): AnimalRescueInfo {
  return {
    rescueLocation: '',
    rescueDate: null,
  };
}

export interface MultiselectFields {
  personality: string[];
  likes: string[];
  behaviorTraits: string[];
}

function createMultiselectFields() {
  return {
    personality: [],
    likes: [],
    behaviorTraits: [],
  };
}

interface SelectFields {
  attitudeTowardsCats: string;
  attitudeTowardsDogs: string;
  attitudeTowardsChildren: string;
  suitabilityForIndoorOrOutdoor: string;
  coatColour: string;
  coatLength: string;
}

function createSelectFields() {
  return {
    attitudeTowardsCats: '',
    attitudeTowardsDogs: '',
    attitudeTowardsChildren: '',
    suitabilityForIndoorOrOutdoor: '',
    coatColour: '',
    coatLength: '',
  };
}

interface TextFields {
  gender: string;
  chronicConditions: string;
  fosterStayDuration: string;
  rescueStory: string;
  description: string;
  specialRequirementsForNewFamily: string;
  additionalNotes: string;
}

function createTextFields() {
  return {
    gender: '',
    chronicConditions: '',
    fosterStayDuration: '',
    rescueStory: '',
    description: '',
    specialRequirementsForNewFamily: '',
    additionalNotes: '',
  };
}

export interface CharacteristicsInfo {
  textFields: TextFields;
  selectFields: SelectFields;
  multiselectFields: MultiselectFields;
}

export function createCharacteristicsInfo(): CharacteristicsInfo {
  return {
    textFields: createTextFields(),
    selectFields: createSelectFields(),
    multiselectFields: createMultiselectFields(),
  };
}

export const fieldLabels = {
  en: {
    personality: 'Personality',
    likes: 'Likes',
    behaviorTraits: 'Behavior Traits',
    attitudeTowardsCats: 'Attitude Towards Cats',
    attitudeTowardsDogs: 'Attitude Towards Dogs',
    attitudeTowardsChildren: 'Attitude Towards Children',
    suitabilityForIndoorOrOutdoor: 'Suitability for Indoor or Outdoor',
    coatColour: 'Coat Colour',
    coatLength: 'Coat Length',
    gender: 'Gender',
    chronicConditions: 'Chronic Conditions',
    fosterStayDuration: 'Foster Stay Duration',
    rescueStory: 'Rescue Story',
    description: 'Description',
    specialRequirementsForNewFamily: 'Special Requirements for New Family',
    additionalNotes: 'Additional Notes',
  },
  et: {
    chronicConditions:
      'Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus palun kirjuta siia sellest',
    fosterStayDuration: 'Kui kaua on kass hoiukodus/kassitoas viibinud?',
    rescueStory:
      'Kas Sa tead, kuidas kiisu meie MTÜ hoole alla sattus? (Kirjelda tema leidmise ajalugu, mis seisundis ta oli jne)',
    personality: 'Iseloom',
    likes: 'Kassile meeldib',
    behaviorTraits: 'Kass',
    description:
      'Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)',
    attitudeTowardsCats: 'Kuidas suhtub teistesse kassidesse?',
    attitudeTowardsDogs: 'Kuidas suhtub koertesse?',
    attitudeTowardsChildren: 'Kuidas suhtub lastesse?',
    suitabilityForIndoorOrOutdoor: 'Kuidas ta sobiks toa- või õuekassikas?',
    specialRequirementsForNewFamily:
      'Erisoovid uuele perele (Vajab kõrvale kassi, ilma lasteta pere, rahulikuma eluviisiga pere, kass vajab suurt tähelepanu jne)',
    additionalNotes:
      'Lisa mis tunned, et puudu jäi või soovid, et kuulutusse märgitud saaks',
  },
};
