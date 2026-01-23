export interface AnimalProfileDto {
    animalId: number;
    title: string;
    description: string;
    profilePictureFilename: string;
    images: string[];
    mainInfo: MainInfo;
    vaccineInfo: VaccineInfo;
    animalRescueInfo: AnimalRescueInfo;
    characteristics: CharacteristicsInfo;
}

interface MainInfo {
    name: string;
    birthDate: Date | null;
    microchip: string;
    microchipRegisteredInLLR: boolean;
    location: string;
}

interface VaccineInfo {
    complexVaccine: Date | null;
    nextComplexVaccineDate: Date | null;
    rabiesVaccine: Date | null;
    nextRabiesVaccineDate: Date | null;
    dewormingOrFleaTreatmentDate: Date | null;
    dewormingOrFleaTreatmentName: string;
}

interface AnimalRescueInfo {
    rescueLocation: string;
    rescueDate: Date | null;
}

export interface MultiselectFields {
    personality: string[];
    likes: string[];
    behaviorTraits: string[];
}


export interface SelectFields {
    attitudeTowardsCats: string;
    attitudeTowardsDogs: string;
    attitudeTowardsChildren: string;
    suitabilityForIndoorOrOutdoor: string;
    coatColour: string;
    coatLength: string;
}

export interface TextFields {
    gender: string;
    spayedOrNeutered: string;
    chronicConditions: string;
    fosterStayDuration: string;
    rescueStory: string;
    description: string;
    specialRequirementsForNewFamily: string;
    additionalNotes: string;
}

export interface CharacteristicsInfo {
    textFields: TextFields;
    selectFields: SelectFields;
    multiselectFields: MultiselectFields;
}