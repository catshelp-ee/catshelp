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
    heading?: string;
    images?: [];
  };
  moreInfo?: {
    chronicIllnesses?: string;
    timeInFosterCare?: string;
    rescueHistory?: string;
    personality?: [];
    likes?: [];
    otherTraits?: [];
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
    images: [],
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
    heading: "",
  },
  moreInfo: {
    chronicIllnesses: "",
    timeInFosterCare: "",
    rescueHistory: "",
    personality: [],
    likes: [],
    otherTraits: [],
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
