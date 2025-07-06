export const formatNumberWithCommas = (value: string): string => {
  const number = value.replace(/\D/g, ""); // فقط عدد نگه دار
  return Number(number).toLocaleString("fa-IR"); // سه رقمی جدا کن با کاما
};

export const removeCommas = (value: string): string => {
  return value.replace(/,/g, "");
};
