import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPayments } from "../../someSlice";
import type { RootState } from "../../store";
import PaymentDiv from "../payment/PaymentDiv";

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

// ✅ محاسبه روز سال شمسی امروز
const getTodayShamsiDayOfYear = (): number => {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const formattedDate = formatter.format(new Date());
  console.log("formattedDate:", formattedDate);

  const parts = formattedDate.split("/").map((part) => part.trim());
  console.log("split parts:", parts);

  const [yearStr, monthStr, dayStr] = parts; // اصلاح ترتیب: سال، ماه، روز
  console.log("yearStr:", yearStr, "monthStr:", monthStr, "dayStr:", dayStr);

  const convertedMonth = convertPersianDigitsToEnglish(monthStr);
  const convertedDay = convertPersianDigitsToEnglish(dayStr);
  console.log("convertedMonth:", convertedMonth, "convertedDay:", convertedDay);

  const month = Number(convertedMonth);
  const day = Number(convertedDay);
  console.log("month:", month, "day:", day);

  if (isNaN(month) || isNaN(day)) {
    console.error("Invalid month or day:", { month, day, monthStr, dayStr });
    return 0; // مقدار پیش‌فرض
  }

  const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonths[i];
  }
  console.log("dayOfYear:", dayOfYear);

  if (isNaN(dayOfYear)) {
    console.error("dayOfYear is NaN:", { month, day, daysInMonths });
    return 0; // مقدار پیش‌فرض
  }

  return dayOfYear;
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

  const { paymentRasShamsi, rasDiffWithToday } = useMemo(() => {
    if (paymentList.length === 0)
      return { paymentRasDay: 0, paymentRasShamsi: "—", rasDiffWithToday: "—" };

    let totalPayment = 0;
    let weightedSum = 0;

    paymentList.forEach((payment) => {
      const price = Number(payment.price ?? 0);
      const day = Number(payment.dayOfYear ?? 0);
      if (!isNaN(price) && !isNaN(day)) {
        // فقط مقادیر معتبر را حساب کن
        totalPayment += price;
        weightedSum += price * day;
      }
    });

    if (totalPayment === 0)
      return { paymentRasDay: 0, paymentRasShamsi: "—", rasDiffWithToday: "—" };

    const paymentRasDay = Math.floor(weightedSum / totalPayment);
    if (isNaN(paymentRasDay)) {
      console.error("paymentRasDay is NaN", { weightedSum, totalPayment });
      return { paymentRasDay: 0, paymentRasShamsi: "—", rasDiffWithToday: "—" };
    }

    const year = getCurrentShamsiYear();
    const paymentRasShamsi = dayOfYearToShamsi(paymentRasDay, year);
    const todayDayOfYear = getTodayShamsiDayOfYear();
    if (isNaN(todayDayOfYear)) {
      console.error("todayDayOfYear is NaN");
      return { paymentRasDay: 0, paymentRasShamsi: "—", rasDiffWithToday: "—" };
    }

    const dayDifference = paymentRasDay - todayDayOfYear;
    const rasDiffWithToday =
      dayDifference === 0
        ? "0 روز"
        : dayDifference > 0
        ? `${dayDifference} روز مانده`
        : `${Math.abs(dayDifference)} روز گذشته`;

    return { paymentRasDay, paymentRasShamsi, rasDiffWithToday };
  }, [paymentList]);

  return (
    <div className="flex flex-col h-dvh w-full bg-base-200 rounded-lg gap-3">
      {/* فیلترها - Sticky Top */}
      <div className="sticky top-0 z-20 py-3 px-4 flex flex-col gap-4 bg-white shadow-md rounded-t-lg">
        <div className="bg-base-100 w-full mx-auto flex flex-row-reverse gap-6 justify-center items-center p-3.5 font-bold rounded-t-xl text-sm">
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
            <div className="flex justify-center items-center gap-3">
              <span className="text-info">{paymentRasShamsi}</span>
              <span className="text-info text-xs">({rasDiffWithToday})</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              type="button"
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
    </div>
  );
}

export default Payment;
