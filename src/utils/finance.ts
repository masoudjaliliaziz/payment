import type { PaymentType } from "../api/getData";

// ✅ تبدیل Day of Year به تاریخ شمسی
const dayOfYearToShamsi = (dayOfYear: number, year: number) => {
  const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let month = 0;

  while (dayOfYear > daysInMonths[month]) {
    dayOfYear -= daysInMonths[month];
    month++;
  }

  const finalMonth = month + 1;
  const finalDay = dayOfYear;

  return `${year}/${finalMonth.toString().padStart(2, "0")}/${finalDay
    .toString()
    .padStart(2, "0")}`;
};

// ✅ تبدیل اعداد فارسی به انگلیسی
const convertPersianDigitsToEnglish = (str: string): string => {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
};

// ✅ گرفتن سال شمسی با اعداد انگلیسی
const getCurrentShamsiYear = (): number => {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
  });
  const yearStr = formatter.format(new Date()); // خروجی مثل "۱۴۰۳"
  return Number(convertPersianDigitsToEnglish(yearStr)); // تبدیل به عدد قابل استفاده
};

export function calculateWeightedAverageDay(paymentList: PaymentType[]): {
  paymentRasDay: number;
  paymentRasShamsi: string;
} {
  let totalPayment = 0;
  let weightedSum = 0;

  paymentList.forEach((payment) => {
    const price = Number(payment.price ?? 0);
    const day = Number(payment.dayOfYear ?? 0);
    totalPayment += price;
    weightedSum += price * day;
  });

  if (totalPayment === 0) return { paymentRasDay: 0, paymentRasShamsi: "—" };

  const paymentRasDay = Math.floor(weightedSum / totalPayment);
  const year = getCurrentShamsiYear();
  const paymentRasShamsi = dayOfYearToShamsi(paymentRasDay, year);

  return { paymentRasDay, paymentRasShamsi };
}
