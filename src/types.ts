export type Cat = {
  chipNumber?: string;
  color?: string;
  coatLength?: string;
  //procedures: Map<number, JSX.Element>;
  //procedureNames: Map<number, string>;
  procedures: { [key: number]: JSX.Element };
  foundDate: Date;
};
