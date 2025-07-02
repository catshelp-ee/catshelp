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