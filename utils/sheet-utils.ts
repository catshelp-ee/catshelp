import { SheetCell, SheetData } from '../types/dashboard';
import {
  CatSheetsHeaders,
  Header,
  headerMapping,
  Row,
} from '../types/google-sheets';

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

export function findUserRows(
  username: string,
  sheetData: SheetData[],
  usernameColIndex: number
): SheetCell[][] {
  if (!sheetData?.[0]?.rowData) {
    return [];
  }

  return sheetData[0].rowData
    .map(row => row.values)
    .filter(row => {
      const fosterhome = row[usernameColIndex];
      return fosterhome?.formattedValue === username;
    });
}

export function extractCatNames(
  rows: SheetCell[][],
  catNameColIndex: number
): string[] {
  return rows
    .map(row => row[catNameColIndex]?.formattedValue)
    .filter((name): name is string => Boolean(name));
}

/**
 * Converts a row of values (in Estonian header order) to an object with English property names
 * @param values - Array of values corresponding to the Estonian headers in order
 * @param estonianHeaders - Array of Estonian header names in the same order as values
 * @returns Object with English property names and corresponding values
 */
function rowToObject(
  values: Row,
  estonianHeaders: (keyof Header)[]
): CatSheetsHeaders {
  const result = {} as CatSheetsHeaders;

  values.row.forEach((value, index) => {
    const estonianHeader = estonianHeaders[index];
    if (estonianHeader && estonianHeader in headerMapping) {
      const englishKey = headerMapping[estonianHeader];
      if (estonianHeader === 'PILT') {
        result[englishKey] = value.hyperlink || '';
        return;
      }
      result[englishKey] = value.formattedValue || '';
    }
  });

  return result;
}

/**
 * Alternative function if you have the values in the exact order of your original interface
 * @param values - Array of 30 values in the exact order of the Header interface
 * @returns Object with English property names and corresponding values
 */
export function rowToObjectFixed(values: Row): CatSheetsHeaders {
  const estonianHeaders: (keyof Header)[] = [
    'KASSI NIMI',
    "PÄÄSTETUD JÄRJEKORRA NR (AA'KK nr ..)",
    'ÜLE 1-AASTASED',
    'ALLA 1-AASTASED',
    'LEPINGU NR',
    'SEIS',
    'ASUKOHT',
    '_HOIUKODU/ KLIINIKU NIMI',
    'MENTOR',
    'SÜNNIAEG',
    'SUGU',
    'KASSI VÄRV',
    'KASSI KARVA PIKKUS',
    'TÄIENDAVAD MÄRKMED',
    'KIIP',
    'KIIP LLR-is MTÜ nimel- täidab registreerija',
    'PILT',
    'PÄÄSTMISKP/ SÜNNIKP',
    'KASSITUPPA SAABUMISE KUUPÄEV',
    'KOJU SAAMISE KUUPÄEV',
    'LEIDMISKOHT',
    'viimati FB-s',
    'viimati kodulehel',
    'LÕIGATUD',
    'KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)',
    'JÄRGMISE VAKTSIINI AEG',
    'MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)',
    'JÄRGMINE MARUTAUDI AEG',
    'USSIROHU/ TURJATILGA KP',
    'Ussirohu/ turjatilga nimi',
    'MUU',
  ];

  return rowToObject(values, estonianHeaders);
}
