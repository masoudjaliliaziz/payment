import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { handleAddTestItem } from "../api/addData";

import type { DebtType } from "../types/apiTypes";
import { toast } from "react-toastify";

type Props = {
  parentGUID: string;
};

function TestAdd({ parentGUID }: Props) {
  const [userName, setUserName] = useState("");
  const [debtDate, setDebtDate] = useState<DateObject | null>(null);
  const [orderNum, setOrderNum] = useState("");
  const [debt, setDebt] = useState("");
  const [dayOfYear, setDayOfYear] = useState<string>("0");

  const mutation = useMutation({
    mutationFn: async () => {
      const data: DebtType = {
        parentGUID: parentGUID,
        debt,
        debtDate: String(debtDate),
        orderNum,
        userName,
        dayOfYear:Number(dayOfYear),
        status: "0",
      };
      console.log(data);
      await handleAddTestItem(data);
    },
    onSuccess: () => {
      setUserName("");
      setDebtDate(null);
      setOrderNum("");
      setDebt("");

      // اختیاری: نوتیفیکیشن یا toast موفقیت

      toast.success("اطلاعات با موفقیت ذخیره شد.");
    },
    onError: (error) => {
      console.error("خطا در ذخیره یا آپلود:", error);
      // اختیاری: نوتیفیکیشن یا toast خطا
    },
  });

  return (
    <>
      <div className="card"></div>
      <div className="p-5 w-full max-w-4xl rounded-lg flex flex-col items-center gap-6 mx-auto  border-2 border-primary bg-base-300 ">
        {/* ورودی سری و سریال */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-start">
          <div className="flex flex-col items-start gap-1 flex-shrink-0">
            <label className="font-bold text-sm text-base-content">
              شماره سفارش
            </label>
            <input
              type="text"
              value={orderNum}
              onChange={(e) => setOrderNum(e.currentTarget.value)}
              className="sm:w-20 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            />
          </div>
          <div className="flex flex-col items-start gap-1 flex-grow">
            <label className="font-bold text-sm text-base-content">
              جمع کل{" "}
            </label>
            <input
              type="text"
              value={debt}
              onChange={(e) => setDebt(e.currentTarget.value)}
              className="w-auto px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* ورودی تاریخ و قیمت */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
          <div className="flex flex-col items-start gap-1 flex-grow">
            <label className="font-bold text-sm text-base-content">تاریخ</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={debtDate}
              onChange={(date) => {
                setDebtDate(date);
                setDayOfYear(String(date?.dayOfYear));
              }}
              inputClass="w-full sm:w-48 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
              placeholder="تاریخ را انتخاب کنید"
              format="YYYY/MM/DD"
            />
          </div>
          <div className="flex flex-col items-start gap-1 flex-grow">
            <label className="font-bold text-sm text-base-content">
              نام مشتری
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              className="w-full sm:w-48 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* آپلود فایل‌ها و دکمه */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
          <button
            type="button"
            onClick={() => mutation.mutate()}
            className={`border-2 font-bold px-5 py-2 rounded-md transition-colors duration-300 flex-shrink-0 ${
              mutation.isPending
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "border-primary hover:bg-white hover:text-gray-800 hover:border-gray-800"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </>
  );
}

export default TestAdd;
