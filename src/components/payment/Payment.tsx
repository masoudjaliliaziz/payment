import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import PaymentDiv from "./PaymentDiv";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPayments } from "../../someSlice";
import type { RootState } from "../../store";

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
    refetchInterval: 3000,
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

  const paymentListWithDayDiff = useMemo(() => {
    if (debtBaseDayOfYear == null) return paymentList;
    return paymentList.map((payment) => ({
      ...payment,
      dayDiff: Number(payment.dayOfYear ?? 0) - Number(debtBaseDayOfYear),
    }));
  }, [paymentList, debtBaseDayOfYear]);

  const { paymentRasShamsi } = useMemo(() => {
    if (paymentList.length === 0)
      return { paymentRasDay: 0, paymentRasShamsi: "—" };

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
  }, [paymentList]);

  return (
    <div className="flex flex-col h-dvh justify-between items-center gap-3 w-full py-6 relative bg-base-200 rounded-lg">
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}

      {isError && <p className="text-red-600">خطا: {String(error)}</p>}

      <div className="p-4 flex flex-col items-center justify-start  gap-4 transition-colors duration-500 w-full h-full overflow-auto ">
        {paymentList.length > 0 && (
          <PaymentDiv
            parentGUID={parentGUID}
            paymentList={paymentListWithDayDiff}
          />
        )}
        {/* <PaymentDiv
          parentGUID={parentGUID}
          paymentList={paymentListWithDayDiff}
        /> */}
      </div>

      {/* ✅ فوتر اطلاعات مالی، مشابه Debt */}
      {/* ✅ فوتر در انتهای صفحه، ولی بدون position: fixed */}
      <div className="bg-base-100 w-[95%] h-24 mx-auto flex flex-row-reverse gap-6 justify-center items-center p-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm sticky bottom-0">
        {/* پرداخت‌های تایید شده */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-success">جمع پرداخت‌های تایید شده</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalFinal.toLocaleString()}</span>
          </div>
        </div>

        {/* پرداخت‌های خزانه */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-info">در انتظار تایید خزانه</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingTreasury.toLocaleString()}
            </span>
          </div>
        </div>

        {/* پرداخت‌های کارشناس */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-warning">در انتظار تایید کارشناس</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingAgent.toLocaleString()}
            </span>
          </div>
        </div>

        {/* راس پرداخت‌ها */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-base-content">راس پرداخت‌ها</span>
          <span className="text-info">{paymentRasShamsi}</span>
        </div>
      </div>
    </div>
  );
}

export default Payment;
