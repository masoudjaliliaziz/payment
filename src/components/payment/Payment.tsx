import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import PaymentDiv from "./PaymentDiv";
import { useEffect, useMemo, useState } from "react";
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
  return `${year}/${(month + 1).toString().padStart(2, "0")}/${dayOfYear
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
  const yearStr = formatter.format(new Date());
  return Number(convertPersianDigitsToEnglish(yearStr));
};

type Props = {
  parentGUID: string;
};

const statusLabels = {
  all: "همه",
  0: "در انتظار تایید کارشناس",
  1: "تایید شده توسط کارشناس",
  2: "رد شده توسط کارشناس",
  3: "رد شده توسط خزانه",
  4: "تایید شده توسط خزانه",
};

function Payment({ parentGUID }: Props) {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] =
    useState<keyof typeof statusLabels>("all");

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

  const filteredPayments = useMemo(() => {
    if (selectedStatus === "all") return paymentListWithDayDiff;
    return paymentListWithDayDiff.filter(
      (p) => Number(p.status) === Number(selectedStatus)
    );
  }, [selectedStatus, paymentListWithDayDiff]);

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
    <div className="flex flex-col h-dvh w-full bg-base-200 rounded-lg gap-3 ">
      {/* فیلترها - Sticky Top */}
      <div className="sticky top-0 z-20  py-3 px-4 flex flex-col gap-4 bg-white shadow-md rounded-t-lg">
        <div className="bg-base-100 w-full  mx-auto flex flex-row-reverse gap-6 justify-center items-center p-3.5 font-bold rounded-t-xl text-sm">
          <div className="flex flex-col gap-3 justify-center items-center">
            <span className="text-success">جمع پرداخت‌های تایید شده</span>
            <div className="flex justify-center items-center gap-3">
              <span className="text-base-content text-xs">ریال</span>
              <span className="text-info">{totalFinal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <span className="text-info">در انتظار تایید خزانه</span>
            <div className="flex justify-center items-center gap-3">
              <span className="text-base-content text-xs">ریال</span>
              <span className="text-info">
                {totalPendingTreasury.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <span className="text-warning">در انتظار تایید کارشناس</span>
            <div className="flex justify-center items-center gap-3">
              <span className="text-base-content text-xs">ریال</span>
              <span className="text-info">
                {totalPendingAgent.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <span className="text-base-content">راس پرداخت‌ها</span>
            <span className="text-info">{paymentRasShamsi}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() =>
                setSelectedStatus(key as keyof typeof statusLabels)
              }
              className={`px-3 py-1 text-sm rounded-full border transition ${
                selectedStatus === key
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* لیست پرداخت‌ها */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading && (
          <span className="loading loading-infinity loading-lg"></span>
        )}
        {isError && <p className="text-red-600">خطا: {String(error)}</p>}
        {filteredPayments.length > 0 && (
          <PaymentDiv parentGUID={parentGUID} paymentList={filteredPayments} />
        )}
      </div>

      {/* فوتر اطلاعات مالی - Sticky Bottom */}
    </div>
  );
}

export default Payment;
