import { sheets_v4 } from 'googleapis';

export interface SheetCell {
    formattedValue?: string;
    hyperlink?: string;
}

export interface SheetData {
    rows: SheetRow[];
}

export interface SheetRow {
    values: SheetCell[]
}

export interface UpdateSheetCellsParams {
    sheetId: string;
    tabName: string;
    find: Record<string, string>;
    data: Record<string, any> & {
        owner: { name: string };
        name: string;
    };
}


export interface Row {
    row: sheets_v4.Schema$CellData[];
}

export interface Headers {
    [key: string]: number;
}
