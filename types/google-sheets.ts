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
  row: CatSheetsHeaders;
  index: number;
}

export interface Row {
  row: sheets_v4.Schema$CellData[];
}

export interface Headers {
  [key: string]: number;
}

export type Rows = RowLocation[];

export interface CatSheetsHeaders {
  catName: string;
  rescueSequenceNumber: string;
  overOneYear: string;
  underOneYear: string;
  contractNumber: string;
  status: string;
  location: string;
  shelterOrClinicName: string;
  mentor: string;
  birthDate: string;
  gender: string;
  catColor: string;
  furLength: string;
  additionalNotes: string;
  microchip: string;
  microchipRegisteredInLLR: string;
  photo: string;
  rescueOrBirthDate: string;
  arrivalAtShelterDate: string;
  adoptionDate: string;
  findingLocation: string;
  lastPostedOnFacebook: string;
  lastPostedOnWebsite: string;
  spayedOrNeutered: string;
  complexVaccine: string;
  nextVaccineDate: string;
  rabiesVaccine: string;
  nextRabiesDate: string;
  dewormingOrFleaTreatmentDate: string;
  dewormingOrFleaTreatmentName: string;
  other: string;
}

export interface Header {
  'KASSI NIMI': string;
  "PÄÄSTETUD JÄRJEKORRA NR (AA'KK nr ..)": string;
  'ÜLE 1-AASTASED': string;
  'ALLA 1-AASTASED': string;
  'LEPINGU NR': string;
  SEIS: string;
  ASUKOHT: string;
  '_HOIUKODU/ KLIINIKU NIMI': string;
  MENTOR: string;
  SÜNNIAEG: string;
  SUGU: string;
  'KASSI VÄRV': string;
  'KASSI KARVA PIKKUS': string;
  'TÄIENDAVAD MÄRKMED': string;
  KIIP: string;
  'KIIP LLR-is MTÜ nimel- täidab registreerija': string;
  PILT: string;
  'PÄÄSTMISKP/ SÜNNIKP': string;
  'KASSITUPPA SAABUMISE KUUPÄEV': string;
  'KOJU SAAMISE KUUPÄEV': string;
  LEIDMISKOHT: string;
  'viimati FB-s': string;
  'viimati kodulehel': string;
  LÕIGATUD: string;
  'KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)': string;
  'JÄRGMISE VAKTSIINI AEG': string;
  'MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)': string;
  'JÄRGMINE MARUTAUDI AEG': string;
  'USSIROHU/ TURJATILGA KP': string;
  'Ussirohu/ turjatilga nimi': string;
  MUU: string;
}

export const headerMapping: Record<keyof Header, keyof CatSheetsHeaders> = {
  'KASSI NIMI': 'catName',
  "PÄÄSTETUD JÄRJEKORRA NR (AA'KK nr ..)": 'rescueSequenceNumber',
  'ÜLE 1-AASTASED': 'overOneYear',
  'ALLA 1-AASTASED': 'underOneYear',
  'LEPINGU NR': 'contractNumber',
  SEIS: 'status',
  ASUKOHT: 'location',
  '_HOIUKODU/ KLIINIKU NIMI': 'shelterOrClinicName',
  MENTOR: 'mentor',
  SÜNNIAEG: 'birthDate',
  SUGU: 'gender',
  'KASSI VÄRV': 'catColor',
  'KASSI KARVA PIKKUS': 'furLength',
  'TÄIENDAVAD MÄRKMED': 'additionalNotes',
  KIIP: 'microchip',
  'KIIP LLR-is MTÜ nimel- täidab registreerija': 'microchipRegisteredInLLR',
  PILT: 'photo',
  'PÄÄSTMISKP/ SÜNNIKP': 'rescueOrBirthDate',
  'KASSITUPPA SAABUMISE KUUPÄEV': 'arrivalAtShelterDate',
  'KOJU SAAMISE KUUPÄEV': 'adoptionDate',
  LEIDMISKOHT: 'findingLocation',
  'viimati FB-s': 'lastPostedOnFacebook',
  'viimati kodulehel': 'lastPostedOnWebsite',
  LÕIGATUD: 'spayedOrNeutered',
  'KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)':
    'complexVaccine',
  'JÄRGMISE VAKTSIINI AEG': 'nextVaccineDate',
  'MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)':
    'rabiesVaccine',
  'JÄRGMINE MARUTAUDI AEG': 'nextRabiesDate',
  'USSIROHU/ TURJATILGA KP': 'dewormingOrFleaTreatmentDate',
  'Ussirohu/ turjatilga nimi': 'dewormingOrFleaTreatmentName',
  MUU: 'other',
};
