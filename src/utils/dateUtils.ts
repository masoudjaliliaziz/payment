// utils/dateUtils.ts

// بررسی سال کبیسه
export function isLeapYear(year: number): boolean {
  return ((year + 38) * 682) % 2816 < 682;
}

// تبدیل تاریخ شمسی (yyyy/mm/dd) به روز سال
export function convertPersianDateToDayOfYear(date: string): number {
  const [year, month, day] = date.split("/").map(Number);
  const persianMonthsDays = [
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
    isLeapYear(year) ? 30 : 29,
  ];

  let dayOfYear = 0;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += persianMonthsDays[i];
  }
  dayOfYear += day;

  return dayOfYear;
}

// تبدیل روز سال به تاریخ شمسی
export function convertDayOfYearToPersianDate(
  dayOfYear: number,
  year: number
): string {
  const persianMonthsDays = [
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
    isLeapYear(year) ? 30 : 29,
  ];

  let remainingDays = dayOfYear;
  let month = 0;

  while (remainingDays > persianMonthsDays[month]) {
    remainingDays -= persianMonthsDays[month];
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return `${year}/${String(month + 1).padStart(2, "0")}/${String(
    remainingDays
  ).padStart(2, "0")}`;
}
