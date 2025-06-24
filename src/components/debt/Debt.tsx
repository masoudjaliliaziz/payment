import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loadDebt } from "../../api/getData";
import { useEffect, useRef } from "react";
import { setDebt } from "../../someSlice";
import type { RootState } from "../../store";
import { isEqual } from "lodash";
import type { DebtType } from "../../types/apiTypes";

// تابع محاسبه سال کبیسه
function isLeapYear(year: number): boolean {
  return ((year + 38) * 682) % 2816 < 682;
}

// تبدیل روز سال به تاریخ شمسی
function convertDayOfYearToPersianDate(
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

type Props = { parentGUID: string };

function Debt({ parentGUID }: Props) {
  const dispatch = useDispatch();

  // گرفتن دیتا با تایپ دقیق
  const {
    data: debtList = [],
    isLoading,
    isError,
    error,
  } = useQuery<DebtType[]>({
    queryKey: ["Debt", parentGUID],
    queryFn: async () => {
      const data = await loadDebt(parentGUID);
      // حذف مقادیر undefined
      return (data as (DebtType | undefined)[]).filter(
        (item): item is DebtType => item !== undefined
      );
    },
    enabled: !!parentGUID,
  });

  // مقادیر redux
  const debtListRedux = useSelector(
    (state: RootState) => state.someFeature.Debt
  );
  const totalDebt = useSelector(
    (state: RootState) => state.someFeature.totalDebt
  );
  const totalDebtDate = useSelector(
    (state: RootState) => state.someFeature.dueDateFinal
  );

  // نگهداری لیست قبلی
  const prevDebtList = useRef<DebtType[]>([]);

  useEffect(() => {
    if (!isEqual(prevDebtList.current, debtList)) {
      dispatch(setDebt(debtList));
      prevDebtList.current = debtList;
    }
  }, [debtList, dispatch]);

  const dueDateDisplay =
    totalDebtDate && totalDebtDate.dayOfYear && totalDebtDate.year
      ? convertDayOfYearToPersianDate(
          totalDebtDate.dayOfYear,
          totalDebtDate.year
        )
      : "نامشخص";

  return (
    <div className="flex-col justify-center items-center gap-3 w-full py-6 h-dvh relative">
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}
      {isError && <p className="text-red-600">خطا: {String(error)}</p>}

      <div className="flex flex-row gap-4 justify-start items-start w-full h-full">
        {debtListRedux.map((Debt, index) => (
          <div
            key={index}
            className="flex w-1/2 items-start justify-between px-6 py-3 rounded-md border-primary border"
          >
            <div className="flex flex-row-reverse items-center gap-5">
              <span className="font-semibold text-sm text-primary">
                جمع کل فاکتور
              </span>
              <span className="font-semibold text-sm text-base-content">
                {String(Debt.debt)}
              </span>
            </div>

            <div className="flex flex-row-reverse items-center gap-5">
              <span className="font-semibold text-sm text-primary">
                شماره فاکتور
              </span>
              <span className="font-semibold text-sm text-base-content">
                {String(Debt.orderNum)}
              </span>
            </div>

            <div className="flex flex-row-reverse items-center gap-5">
              <span className="font-semibold text-sm text-primary">
                تاریخ ایجاد فاکتور
              </span>
              <span className="font-semibold text-sm text-base-content">
                {String(Debt.debtDate)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-base-100 sticky bottom-3 w-1/2 mx-auto flex flex-row-reverse gap-3 justify-center items-center p-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-primary">جمع کل بدهی</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalDebt.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-primary">تاریخ سررسید</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-info">{String(dueDateDisplay)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debt;
