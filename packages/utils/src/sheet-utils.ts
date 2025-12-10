import { SheetCell } from '@catshelp/types/src';

export function extractColumnMapping(
    rowData: SheetCell[]
): Record<string, number> {
    const mapping: Record<string, number> = {};

    rowData.forEach((col, idx) => {
        if (col.formattedValue) {
            mapping[col.formattedValue] = idx;
        }
    });

    return mapping;
}

export function extractCatNames(rows: SheetCell[][], catNameColIndex: number): string[] {
    return rows
        .map(row => row[catNameColIndex]?.formattedValue)
        .filter((name): name is string => Boolean(name));
}
