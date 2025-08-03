import { useQuery } from "@tanstack/react-query";
import { loadDebt, loadPayment, type PaymentType } from "../../api/getData";
import type { DebtType } from "../../types/apiTypes";
import { useEffect, useMemo, useState } from "react";
import { calculateRasDateDebt } from "../../utils/calculateRasDate";
import { getShamsiDateFromDayOfYear } from "../../utils/getShamsiDateFromDayOfYear";

type Props = { parentGUID: string };

function Debt({ parentGUID }: Props) {
  const [totalDebt, setTotalDebt] = useState(0);
  const [dueDateDisplay, setDueDateDisplay] = useState("");

  // پرداختی‌ها
  const {
    data: paymentList = [],
    isLoading: isLoadingPayments,
    isError: isErrorPayments,
    error: errorPayments,
  } = useQuery<PaymentType[]>({
    queryKey: ["payments", parentGUID],
    queryFn: async () => {
      const data = await loadPayment(parentGUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined && item.status === "4"
      ); // 👈 فقط استاتوس ۴
    },
    enabled: !!parentGUID,
    refetchInterval: 5000,
  });

  // بدهی‌ها
  const {
    data: debtList = [],
    isLoading: isLoadingDebts,
    isError: isErrorDebts,
    error: errorDebts,
  } = useQuery<DebtType[]>({
    queryKey: ["Debt", parentGUID],
    queryFn: async () => {
      const data = await loadDebt(parentGUID);
      return (data as (DebtType | undefined)[]).filter(
        (item): item is DebtType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 5000,
  });

  // خروجی پس از محاسبه بدهی‌ها با توجه به پرداختی
  const output: (DebtType & { originalDebt: string })[] = useMemo(() => {
    const totalPaid = paymentList.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
    const sortedDebts = [...debtList]
      .filter((d) => d.debt && d.dayOfYear)
      .sort((a, b) => Number(a.dayOfYear) - Number(b.dayOfYear));

    let remainingPayment = totalPaid;
    const result: (DebtType & { originalDebt: string })[] = [];

    for (const debt of sortedDebts) {
      const currentDebt = Number(debt.debt || 0);

      if (remainingPayment >= currentDebt) {
        remainingPayment -= currentDebt;
        result.push({ ...debt, debt: "0", originalDebt: debt.debt || "0" });
      } else if (remainingPayment > 0) {
        const newDebt = currentDebt - remainingPayment;
        result.push({
          ...debt,
          debt: String(newDebt),
          originalDebt: debt.debt || "0",
        });
        remainingPayment = 0;
      } else {
        result.push({ ...debt, originalDebt: debt.debt || "0" });
      }
    }

    return result;
  }, [paymentList, debtList]);

  // محاسبه تراز و تاریخ سررسید

  const totalOriginalDebt = useMemo(() => {
    return debtList.reduce((sum, item) => sum + Number(item.debt || 0), 0);
  }, [debtList]);

  const totalPaid = useMemo(() => {
    return paymentList.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [paymentList]);

  const remainingBalance = totalPaid - totalOriginalDebt;

  const balanceStatus = remainingBalance >= 0 ? "بستانکار" : "بدهکار";
  const balanceColor =
    remainingBalance >= 0 ? "text-green-600" : "text-red-600";

  useEffect(() => {
    const totalDebtCalculated = output.reduce(
      (sum, item) => sum + Number(item.debt || 0),
      0
    );
    const dueDateDisplayCalculated = calculateRasDateDebt(output);

    setTotalDebt(totalDebtCalculated);
    if (
      dueDateDisplayCalculated !== null &&
      dueDateDisplayCalculated !== undefined
    ) {
      setDueDateDisplay(getShamsiDateFromDayOfYear(dueDateDisplayCalculated));
    }
  }, [output]);

  // نمایش بارگذاری یا خطا
  if (isLoadingPayments || isLoadingDebts)
    return <div className="text-center text-lg">در حال بارگذاری...</div>;

  if (isErrorPayments || isErrorDebts)
    return (
      <div className="text-center text-red-600">
        خطا: {String(errorPayments || errorDebts)}
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full py-6 h-dvh relative rounded-lg">
      <div className="flex flex-col gap-4 justify-start items-start w-full h-full flex-wrap">
        {output.map((debt, index) => {
          const debtAmount = Number(debt.debt?.trim() || "0");
          const isSettled = !isNaN(debtAmount) && debtAmount === 0;
          return (
            <div
              key={index}
              className={`grid grid-cols-5  p-3 rounded-md shadow-md w-full items-center justify-center bg-red-500${
                index % 2 === 0 ? "bg-base-300" : "bg-base-100"
              }`}
            >
              <div className="flex flex-row-reverse items-center gap-1.5 ">
                <span className="font-semibold text-sm text-primary">
                  جمع کل
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Number(debt.originalDebt).toLocaleString() || "نامشخص"}
                </span>
              </div>

              <div className="flex flex-row-reverse items-center gap-1.5 ">
                <span className="font-semibold text-sm text-primary">
                  باقی‌مانده
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Number(debt.debt).toLocaleString() || "نامشخص"}
                </span>
              </div>

              {/* بقیه فیلدها مثل شماره فاکتور و تاریخ */}
              <div className="flex flex-row-reverse items-center gap-1.5 ">
                <span className="font-semibold text-sm text-primary">
                  شماره فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {debt.orderNum}
                </span>
              </div>
              <div className="flex justify-center items-center gap-1.5 ">
                {isSettled ? (
                  <span className="text-green-600 font-bold text-xs ">
                    تسویه شده
                  </span>
                ) : (
                  <span className="text-red-600 font-bold text-xs  ">
                    پرداخت نشده
                  </span>
                )}
              </div>
              <div className="flex flex-row-reverse items-center gap-1.5 ">
                <span className="font-semibold text-sm text-primary">
                  تاریخ ایجاد فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {debt.debtDate}
                </span>
              </div>

              {/* بقیه اطلاعات فاکتور */}
            </div>
          );
        })}
      </div>

      {/* بخش پایین اطلاعات */}
      <div className="bg-base-100 sticky bottom-0 w-[95%] h-24 mx-auto flex flex-row-reverse gap-6 justify-between items-center px-7 py-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm">
        {/* جمع کل بدهی */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-primary">جمع کل بدهی</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalDebt.toLocaleString()}</span>
          </div>
        </div>

        {/* تاریخ سررسید */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-primary">تاریخ سررسید</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-info">{dueDateDisplay || "نامشخص"}</span>
          </div>
        </div>

        {/* تراز مالی */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <div>
            <span className="text-primary">تراز مالی</span>
            <div className="flex justify-center items-center gap-3">
              {" "}
              <span className={balanceColor}>
                {Math.abs(remainingBalance).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <span className={balanceColor}>{balanceStatus}</span>
      </div>
    </div>
  );
}

export default Debt;
