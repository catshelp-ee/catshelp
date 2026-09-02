export interface FilterState {
    location: string[];
    fosterHome: string[];
    gender: Gender[];
    ageGroup: AgeGroup[];
    sterilised: boolean | null;
    medicalOngoing: boolean | null;
    hasOverdueTasks: boolean | null;
    hasDueSoonTasks: boolean | null;
    published: boolean | null;
    searchQuery: string;
}

export type Gender = 'Male' | 'Female' | 'Unknown';

export type FurType = 'Short' | 'Long' | 'Medium';

export type AgeGroup = 'kitten' | 'adult';