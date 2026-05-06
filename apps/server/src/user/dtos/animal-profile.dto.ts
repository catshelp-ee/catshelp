export interface AnimalProfileDto {
    animalId: number;
    images: string[];
    mainInfo: MainInfoDto;
    personalityInfo: PersonalityInfoDto;
}

interface MainInfoDto {
    name: string;
    rankNr: string;
    birthDate: Date | null;
    rescueDate: Date | null;
    gender: string;
    coatColour: string;
    coatLength: string;
    location: string;
    microchip: string;
    fosterStayDuration: string;
    chronicConditions: string;
    description: string;
    rescueStory: string;
    status: string;
    chipRegisteredWithUs: boolean;
    specialRequirementsForNewFamily: string;
    additionalNotes: string;
    spayedOrNeutered: string;
}

interface PersonalityInfoDto {
    bold: boolean,
    shy: boolean,
    active: boolean,
    veryActive: boolean,
    calm: boolean,
    friendly: boolean,
    grumpy: boolean,
    vocal: boolean,
    dislikesTouching: boolean,
    sociable: boolean,
    aloof: boolean,
    goodAppetite: boolean,
    curious: boolean,
    playful: boolean,
    stressed: boolean,
    sensitive: boolean,
    peaceful: boolean,
    selfish: boolean,
    hisses: boolean,
    beingOnLap: boolean,
    sleepsCuddling: boolean,
    likesPetting: boolean,
    likesAttention: boolean,
    likesPlayingWithPeople: boolean,
    likesPlayingAlone: boolean,
    usesLitterbox: boolean,
    usesScratchingpost: boolean,
    selectiveWithFood: boolean,
    adaptable: boolean,
    scratchesFurniture: boolean,
    trusting: boolean,
    description: string,
    attitudeTowardsCats: string,
    attitudeTowardsDogs: string,
    attitudeTowardsChildren: string,
    suitabilityForIndoorOrOutdoor: string,
}
