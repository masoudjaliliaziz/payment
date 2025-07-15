export type DebtType = {
  parentGUID: string;
  debt: string;
  debtDate: string;
  orderNum: string;
  userName: string;
  dayOfYear: number;
  status: string;
};
export type PaymentType = {
  ID: number;
  price: string;
  dueDate: string;
  serial: string;
  seri: string;
  parentGUID: string;
  Title: string;
  status: string;
  agentDescription: string;
  agentUnconfirmReason: string;
  treasuryConfirmDescription: string;
  treasuryUnconfirmReason: string;
  dayOfYear: string;
};

export type SayadiResultType = {
  iban: string;
  issuedDate: string;
  expirationDate: string;
  serialNo: string;
  seriesNo: string;
  mediaType: string;
  branchCode: string;
  name: string;
  returnedCheques: null | string;
};
