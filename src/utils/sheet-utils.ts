import { SheetCell, SheetData } from '@types/dashboard';

export function extractColumnMapping(rowData: SheetCell[]): Record<string, number> {
    const mapping: Record<string, number> = {};
    
    rowData.forEach((col, idx) => {
        if (col.formattedValue) {
            mapping[col.formattedValue] = idx;
        }
    });
    
    return mapping;
}

export function findUserRows(
    username: string,
    sheetData: SheetData[],
    usernameColIndex: number
): SheetCell[][] {
    if (!sheetData?.[0]?.rowData) return [];
    
    return sheetData[0].rowData
        .map(row => row.values)
        .filter(row => {
            const fosterhome = row[usernameColIndex];
            return fosterhome?.formattedValue === username;
        });
}

export function extractCatNames(rows: SheetCell[][], catNameColIndex: number): string[] {
    return rows
        .map(row => row[catNameColIndex]?.formattedValue)
        .filter((name): name is string => Boolean(name));
}