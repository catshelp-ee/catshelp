export interface User {
    id: number;
    fullName: string;
    role: string | null;
    email: string | null;
    identityCode: string | null;
    citizenship: string | null;
    createdAt: Date;
}