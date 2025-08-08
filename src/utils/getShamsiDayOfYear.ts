// تابع کمکی برای بررسی سال کبیسه شمسی
function isShamsiLeapYear(year: number): boolean {
  const cycle = year % 33;
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(cycle);
}

// تابع تبدیل تاریخ میلادی به شمسی
function toShamsiDate(gregorianDate: Date): {
  year: number;
  month: number;
  day: number;
} {
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth();
  const gregorianDay = gregorianDate.getDate();

  // تبدیل تقریبی تاریخ میلادی به شمسی
  let shamsiYear = gregorianYear - 621;
  const shamsiEpoch = new Date(gregorianYear, gregorianMonth, gregorianDay);
  const persianNewYear = new Date(gregorianYear, 2, 20); // نوروز تقریبی (20 یا 21 مارس)

  // تنظیم دقیق‌تر برای نوروز
  if (shamsiEpoch < persianNewYear) {
    shamsiYear--;
  }

  // محاسبه تعداد روزهای گذشته از ابتدای سال میلادی
  const startOfGregorianYear = new Date(gregorianYear, 0, 1);
  const daysSinceGregorianYearStart = Math.floor(
    (shamsiEpoch.getTime() - startOfGregorianYear.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // تبدیل به روز سال شمسی
  let daysSincePersianNewYear = daysSinceGregorianYearStart - 79; // نوروز حدوداً 79 روز بعد از ابتدای سال میلادی
  if (daysSincePersianNewYear < 0) {
    daysSincePersianNewYear += isShamsiLeapYear(shamsiYear - 1) ? 366 : 365;
  }

  let shamsiMonth = 1;
  let shamsiDay = daysSincePersianNewYear;

  const daysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    isShamsiLeapYear(shamsiYear) ? 30 : 29,
  ];

  let remainingDays = shamsiDay;
  for (let i = 0; i < daysInMonth.length; i++) {
    if (remainingDays <= daysInMonth[i]) {
      shamsiMonth = i + 1;
      shamsiDay = remainingDays;
      break;
    }
    remainingDays -= daysInMonth[i];
  }

  return { year: shamsiYear, month: shamsiMonth, day: shamsiDay };
}

// تابع محاسبه روز سال شمسی
export function getShamsiDayOfYear(): number {
  const today = new Date();
  const { year, month, day } = toShamsiDate(today);

  // تعداد روزهای هر ماه
  const daysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    isShamsiLeapYear(year) ? 30 : 29,
  ];

  // محاسبه تعداد روزهای گذشته از ابتدای سال
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonth[i];
  }

  return dayOfYear;
}
