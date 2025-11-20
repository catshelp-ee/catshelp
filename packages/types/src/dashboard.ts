import { SheetData } from "./google-sheets";

export interface SheetsData {
    cats?: SheetData[];
    contracts?: SheetData[];
}

export interface Result {
    assignee: string;
    urgent: boolean;
    label: string;
    due: string;
    action: {
        label: string;
        redirect: string;
    };
    catColour: string;
}

export interface ImageDownloadResult {
    image: string;
    name: string;
}
