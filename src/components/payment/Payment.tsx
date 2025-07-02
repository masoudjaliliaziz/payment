import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import PaymentDiv from "./PaymentDiv";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPayments } from "../../someSlice";
import type { RootState } from "../../store";

type Props = {
  parentGUID: string;
};

function Payment({ parentGUID }: Props) {
  const dispatch = useDispatch();

  const {
    data: paymentList = [],
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
  });

  useEffect(() => {
    if (paymentList.length > 0) {
      dispatch(setPayments(paymentList));
    }
  }, [paymentList, dispatch]);

  const {
    totalFinal,
    totalPendingAgent,
    totalPendingTreasury,
    debtBaseDayOfYear,
  } = useSelector((state: RootState) => state.someFeature);

  // ✅ اختلاف هر پرداخت با تاریخ سررسید (dayDiff)
  const paymentListWithDayDiff = useMemo(() => {
    if (debtBaseDayOfYear == null) return paymentList;

    return paymentList.map((payment) => ({
      ...payment,
      dayDiff: Number(payment.dayOfYear ?? 0) - Number(debtBaseDayOfYear),
    }));
  }, [paymentList, debtBaseDayOfYear]);

  // ✅ محاسبه راس‌گیری پرداخت‌ها
  const paymentRas = useMemo(() => {
    if (paymentList.length === 0) return 0;

    let totalPayment = 0;
    let weightedSum = 0;

    paymentList.forEach((payment) => {
      const price = Number(payment.price ?? 0);
      const day = Number(payment.dayOfYear ?? 0);

      totalPayment += price;
      weightedSum += price * day;
    });

    if (totalPayment === 0) return 0;

    return Math.floor(weightedSum / totalPayment);
  }, [paymentList]);

  return (
    <div className="bg-base-100 p-4 flex flex-col items-center justify-start min-h-screen gap-3 transition-colors duration-500 w-full relative">
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}

      {isError && <p className="text-red-600">خطا: {String(error)}</p>}

      {paymentList.length > 0 && (
        <PaymentDiv paymentList={paymentListWithDayDiff} />
      )}

      <div className="bg-base-100 sticky bottom-3 w-1/2 mx-auto flex flex-row-reverse gap-3 justify-around items-center p-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-success">جمع پرداخت‌های تایید شده</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalFinal.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-info">
            جمع پرداخت‌های در انتظار تایید خزانه
          </span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingTreasury.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-warning">
            جمع پرداخت‌های در انتظار تایید کارشناس
          </span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingAgent.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ✅ نمایش راس‌گیری پرداخت‌ها */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-base-content">راس پرداخت‌ها (Day of Year)</span>
          <span className="text-info">{paymentRas}</span>
        </div>
      </div>
    </div>
  );
}

export default Payment;
