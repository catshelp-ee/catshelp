export interface AnimalSummary {
    name: string;
    id: number;
    profilePicture: string;
    status: string;
    rescueNumber: string;
    birthDate: string;
    fosterHome: string;
    location: string;
    gender: 'Male' | 'Female' | 'Unknown';
    sterilised: boolean;
    medicalOngoing: boolean;
    overdueCount: number;
    dueSoonCount: number;
    complexVaccineDate: string;
    published: boolean;
}
