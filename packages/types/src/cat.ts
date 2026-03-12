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

export interface Avatar {
    id: string;
    name: string;
    pathToImage: string;
}

export interface Profile {
    animalId: number;
    images: string[];
    mainInfo: MainInfo;
    personalityInfo: PersonalityInfo;
}

export interface ProfileHeader {
    id: number,
    name: string
}

export function createProfile(): Profile {
    return {
        animalId: -1,
        images: [],
        mainInfo: createMainInfo(),
        personalityInfo: createPersonalityInfo(),
    };
}

interface MainInfo {
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

function createMainInfo(): MainInfo {
    return {
        name: '',
        rankNr: '',
        birthDate: null,
        rescueDate: null,
        gender: '',
        coatColor: '',
        coatLength: '',
        microchip: '',
        location: '',
        fosterStayDuration: '',
        chronicConditions: '',
        description: '',
        rescueStory: ''
    };
}

export interface PersonalityInfo {
    bold: boolean;
    shy: boolean;
    active: boolean;
    veryActive: boolean;
    calm: boolean;
    friendly: boolean;
    grumpy: boolean;
    vocal: boolean;
    dislikesTouching: boolean;
    sociable: boolean;
    aloof: boolean;
    goodAppetite: boolean;
    curious: boolean;
    playful: boolean;
    stressed: boolean;
    sensitive: boolean;
    peaceful: boolean;
    selfish: boolean;
    hisses: boolean;
    beingInLap: boolean;
    sleepsCuddling: boolean;
    likesPetting: boolean;
    likesAttention: boolean;
    likesPlayingWithPeople: boolean;
    likesPlayingAlone: boolean;
    usesLitterbox: boolean;
    usesScratchingpost: boolean;
    selectiveWithFood: boolean;
    adaptable: boolean;
    scratchesFurniture: boolean;
    trusting: boolean;
    description: string;
    attitudeTowardsCats: string;
    attitudeTowardsDogs: string;
    attitudeTowardsChildren: string;
    suitabilityForIndoorOrOutdoor: string;
    specialRequirementsForNewFamily: string;
}

export function createPersonalityInfo(): PersonalityInfo {
    return {
        bold: false,
        shy: false,
        active: false,
        veryActive: false,
        calm: false,
        friendly: false,
        grumpy: false,
        vocal: false,
        dislikesTouching: false,
        sociable: false,
        aloof: false,
        goodAppetite: false,
        curious: false,
        playful: false,
        stressed: false,
        sensitive: false,
        peaceful: false,
        selfish: false,
        hisses: false,
        beingInLap: false,
        sleepsCuddling: false,
        likesPetting: false,
        likesAttention: false,
        likesPlayingWithPeople: false,
        likesPlayingAlone: false,
        usesLitterbox: false,
        usesScratchingpost: false,
        selectiveWithFood: false,
        adaptable: false,
        scratchesFurniture: false,
        trusting: false,
        description: '',
        attitudeTowardsCats: '',
        attitudeTowardsDogs: '',
        attitudeTowardsChildren: '',
        suitabilityForIndoorOrOutdoor: '',
        specialRequirementsForNewFamily: ''
    };
}