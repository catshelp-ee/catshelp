import { sheets_v4 } from 'googleapis';

export interface SheetData {
  rows: SheetRow[];
}

export interface SheetRow {
  values: Array<{
    formattedValue?: string;
    hyperlink?: string;
  }>;
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

export interface RowLocation {
  row: any;
  rowIndex: number;
}

export interface Headers{
  [key: string]: number;
}

export type Row = sheets_v4.Schema$CellData[];
export type Rows = Row[];
