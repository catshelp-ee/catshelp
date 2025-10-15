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

export interface RowLocation {
  row: CatSheetsHeaders;
  index: number;
  id: number;
}

export interface Row {
  row: sheets_v4.Schema$CellData[];
}

export interface Headers {
  [key: string]: number;
}

export type Rows = RowLocation[];

export interface CatSheetsHeaders {
  catName: string | null | undefined;
  rescueSequenceNumber: string | null | undefined;
  overOneYear: string | null | undefined;
  underOneYear: string | null | undefined;
  contractNumber: string | null | undefined;
  status: string | null | undefined;
  location: string | null | undefined;
  shelterOrClinicName: string | null | undefined;
  mentor: string | null | undefined;
  birthDate: string | null | undefined;
  gender: string | null | undefined;
  catColor: string | null | undefined;
  furLength: string | null | undefined;
  additionalNotes: string | null | undefined;
  microchip: string | null | undefined;
  microchipRegisteredInLLR: string | null | undefined;
  photo: string | null | undefined;
  rescueOrBirthDate: string | null | undefined;
  arrivalAtShelterDate: string | null | undefined;
  adoptionDate: string | null | undefined;
  findingLocation: string | null | undefined;
  lastPostedOnFacebook: string | null | undefined;
  lastPostedOnWebsite: string | null | undefined;
  spayedOrNeutered: string | null | undefined;
  complexVaccine: string | null | undefined;
  nextVaccineDate: string | null | undefined;
  rabiesVaccine: string | null | undefined;
  nextRabiesDate: string | null | undefined;
  dewormingOrFleaTreatmentDate: string | null | undefined;
  dewormingOrFleaTreatmentName: string | null | undefined;
  other: string | null | undefined;
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
