export type Cat = {
  chipNumber?: string;
  color?: string;
  coatLength?: string;
  //procedures: Map<number, JSX.Element>;
  //procedureNames: Map<number, string>;
  procedures: { [key: number]: JSX.Element };
  proceduresValues: { [key: string]: string };
  foundDate: Date;
};

export type CatFormData = {
  pildid?: File[];
  nimi: string;
  synniaeg: string;
  sugu: string;
  loigatud: boolean;
  leidmis_kp: string;
  leidmiskoht: string;
  karva_pikkus: string;
  varv: string;
  kiibi_nr: string;
  llr: boolean;
  lisa: string;
};
