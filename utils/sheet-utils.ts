import { sheets_v4 } from 'googleapis';
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
export function sheetsRowToObject(row: sheets_v4.Schema$CellData[]): CatSheetsHeaders {
  return {
    catName: row[0].formattedValue,
    rescueSequenceNumber: row[1].formattedValue,
    overOneYear: row[2].formattedValue,
    underOneYear: row[3].formattedValue,
    contractNumber: row[4].formattedValue,
    status: row[5].formattedValue,
    location: row[6].formattedValue,
    shelterOrClinicName: row[7].formattedValue,
    mentor: row[8].formattedValue,
    birthDate: row[9].formattedValue,
    gender: row[10].formattedValue,
    catColor: row[11].formattedValue,
    furLength: row[12].formattedValue,
    additionalNotes: row[13].formattedValue,
    microchip: row[14].formattedValue,
    microchipRegisteredInLLR: row[15].formattedValue,
    photo: row[16].formattedValue,
    rescueOrBirthDate: row[17].formattedValue,
    arrivalAtShelterDate: row[18].formattedValue,
    adoptionDate: row[19].formattedValue,
    findingLocation: row[20].formattedValue,
    lastPostedOnFacebook: row[21].formattedValue,
    lastPostedOnWebsite: row[22].formattedValue,
    spayedOrNeutered: row[23].formattedValue,
    complexVaccine: row[24].formattedValue,
    nextVaccineDate: row[25].formattedValue,
    rabiesVaccine: row[26].formattedValue,
    nextRabiesDate: row[27].formattedValue,
    dewormingOrFleaTreatmentDate: row[28].formattedValue,
    dewormingOrFleaTreatmentName: row[29].formattedValue,
    other: row[30].formattedValue,
  }
}
