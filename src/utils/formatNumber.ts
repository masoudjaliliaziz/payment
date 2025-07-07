// تبدیل عدد به رشته با کاما
export const formatNumber = (num: number | "") =>
  num === "" ? "" : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// تبدیل رشته به عدد خام
export const parseNumber = (str: string): number | "" => {
  const cleaned = str.replace(/,/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? "" : parsed;
};
