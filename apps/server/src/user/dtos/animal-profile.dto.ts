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
    coatColor: string;
    coatLength: string;
    location: string;
    microchip: string;
    fosterStayDuration: string;
    chronicConditions: string;
    description: string;
    rescueStory: string;
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
    beingInLap: boolean,
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
    specialRequirementsForNewFamily: string
}
