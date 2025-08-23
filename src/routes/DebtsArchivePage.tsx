import { useQuery } from "@tanstack/react-query";
import { useParentGuid } from "../hooks/useParentGuid";
import { loadDebt, loadPayment, type PaymentType } from "../api/getData";
import { useMemo } from "react";
import type { DebtType } from "../types/apiTypes";
import {
  calculateRasDateDebt,
  calculateRasDatePayment,
} from "../utils/calculateRasDate";

function DebtsArchivePage() {
  const parentGUID = useParentGuid();
  const {
    data: payment = [],
    isLoading,
    isError,
    error,
  } = useQuery<PaymentType[]>({
    queryKey: ["payments", parentGUID],
    queryFn: async () => {
      const data = await loadPayment(parentGUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 30000,
  });

  const paymentList = useMemo(() => {
    return payment.filter((item) => item.status === "4");
  }, [payment]);

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
    refetchInterval: 30000,
  });
  const isValidNumber = (value: string | undefined): boolean => {
    return value !== undefined && !isNaN(Number(value));
  };

  const settledDebts = useMemo(() => {
    const totalPaid = paymentList.reduce(
      (sum, item) =>
        isValidNumber(item.price) ? sum + Number(item.price) : sum,
      0
    );
    const sortedDebts = [...debtList]
      .filter(
        (d) => isValidNumber(d.debt) && isValidNumber(String(d.dayOfYear))
      )
      .sort((a, b) => Number(a.dayOfYear) - Number(b.dayOfYear));

    let remainingPayment = totalPaid;
    return sortedDebts.reduce<(DebtType & { originalDebt: string })[]>(
      (acc, debt) => {
        const currentDebt = Number(debt.debt);
        const originalDebt = debt.debt || "0";

        if (remainingPayment >= currentDebt) {
          remainingPayment -= currentDebt;
          acc.push({ ...debt, debt: "0", originalDebt });
        }

        return acc;
      },
      []
    );
  }, [debtList, paymentList]);

  const totalSettledDebt = useMemo(() => {
    return settledDebts.reduce(
      (sum, debt) =>
        isValidNumber(debt.originalDebt)
          ? sum + Number(debt.originalDebt)
          : sum,
      0
    );
  }, [settledDebts]);
  const settledDebtsForRas = useMemo(() => {
    return settledDebts.map((d) => ({
      ...d,
      debt: d.originalDebt, // تضمین اینکه تابع Ras مبلغ اصلی رو بگیره
    }));
  }, [settledDebts]);

  const dueDateDisplayCalculated = useMemo(() => {
    if (settledDebtsForRas.length > 0) {
      return calculateRasDateDebt(settledDebtsForRas);
    }
    return null;
  }, [settledDebtsForRas]);

  const rasDayOfYearAllPaymnets = calculateRasDatePayment(paymentList);
  const dayDifference =
    rasDayOfYearAllPaymnets !== null && dueDateDisplayCalculated !== null
      ? rasDayOfYearAllPaymnets - dueDateDisplayCalculated
      : null;

  const differenceText =
    dayDifference !== null
      ? dayDifference === 0
        ? "0 روز"
        : dayDifference > 0
        ? `${dayDifference} روز مانده`
        : `${Math.abs(dayDifference)} روز گذشته`
      : "—";
  if (!parentGUID) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        در حال بارگذاری اطلاعات فرم...
      </div>
    );
  }

  if (isLoading || isLoadingDebts) {
    return <div className="text-center text-lg">در حال بارگذاری...</div>;
  }

  if (isError || isErrorDebts) {
    return (
      <div className="text-center text-red-600">
        خطا: {String(error || errorDebts)}
      </div>
    );
  }

  return (
    <section className="w-full mt-8 px-4">
      {settledDebts.length > 0 ? (
        <>
          <div className="text-center rounded-md flex flex-col justify-center items-center gap-3 mb-8 w-1/3 mx-auto p-6 shadow-sm">
            <span className="font-bold text-lg">جمع کل بدهی‌های آرشیو شده</span>
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <span className="font-bold text-green-700 text-xl">
                {totalSettledDebt.toLocaleString()}
              </span>
              <span className="font-bold text-lg text-sky-500">ریال</span>
            </div>
          </div>
          <div className="text-center rounded-md flex flex-col justify-center items-center gap-3 mb-8 w-1/3 mx-auto p-6 shadow-sm">
            <span className="font-bold text-lg">
              اختلاف روز با راس پرداخت ها
            </span>
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <span className="font-bold text-green-700 text-xl">
                {differenceText}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {settledDebts.map((debt, index) => (
              <article
                key={index}
                className="grid grid-cols-5 p-3 rounded-md shadow-sm bg-green-50 items-center"
              >
                <div className="flex flex-row-reverse items-center gap-1.5">
                  <span className="font-semibold text-sm text-primary">
                    جمع کل
                  </span>
                  <span className="font-semibold text-sm text-base-content">
                    {Number(debt.originalDebt).toLocaleString()}
                  </span>
                  <span className="text-base-content text-xs">ریال</span>
                </div>

                <div className="flex flex-row-reverse items-center gap-1.5">
                  <span className="font-semibold text-sm text-primary">
                    باقی‌مانده
                  </span>
                  <span className="font-semibold text-sm text-green-600">
                    0
                  </span>
                  <span className="text-base-content text-xs">ریال</span>
                </div>

                <div className="flex flex-row-reverse items-center gap-1.5">
                  <span className="font-semibold text-sm text-primary">
                    شماره فاکتور
                  </span>
                  <span className="font-semibold text-sm text-base-content">
                    {debt.orderNum}
                  </span>
                </div>

                <div className="flex justify-center items-center">
                  <span className="text-green-600 font-bold text-xs">
                    تسویه شده
                  </span>
                </div>

                <div className="flex flex-row-reverse items-center gap-1.5">
                  <span className="font-semibold text-sm text-primary">
                    تاریخ ایجاد فاکتور
                  </span>
                  <span className="font-semibold text-sm text-base-content">
                    {debt.debtDate}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          هیچ بدهی تسویه‌شده‌ای وجود ندارد. لطفاً برای افزودن بدهی جدید اقدام
          کنید.
        </div>
      )}
    </section>
  );
}

export default DebtsArchivePage;
