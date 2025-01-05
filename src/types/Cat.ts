export interface Cat {
  primaryInfo: {
    name?: string;
    rescueId?: string;
    location?: string;
    dateOfBirth?: string;
    gender?: string;
    color?: string;
    furLength?: string;
    additionalNotes?: string;
    chipId?: string;
    rescueDate?: string;
    description?: string;
    image?: string;
  };
  moreInfo?: {
    chronicIllnesses?: string;
    timeInFosterCare?: string;
    rescueHistory?: string;
    personality?: string;
    likes?: string;
    otherPersonalityTraits?: string;
    dailyRoutine?: string;
    interactions?: {
      cats?: string;
      dogs?: string;
      children?: string;
    };
    type?: string;
    specialNeeds?: string;
    otherInfo?: string;
  };
}

export const defaultCat: Cat = {
  primaryInfo: {
    name: "",
    image: "",
    rescueId: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    color: "",
    furLength: "",
    additionalNotes: "",
    chipId: "",
    rescueDate: "",
    description: "",
  },
  moreInfo: {
    chronicIllnesses: "",
    timeInFosterCare: "",
    rescueHistory: "",
    personality: "",
    likes: "",
    otherPersonalityTraits: "",
    dailyRoutine: "",
    interactions: {
      cats: "",
      dogs: "",
      children: "",
    },
    type: "",
    specialNeeds: "",
    otherInfo: "",
  },
};
