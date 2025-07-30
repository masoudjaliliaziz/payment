import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import uuidv4 from "../../utils/createGuid";
import type { uploadCheckoutProps } from "./UploadTypes";
import { handleAddItem } from "../../api/addData";
import { FileUploader, type FileUploaderHandle } from "./FileUploader";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setPrice } from "../../someSlice";
import { useCustomers } from "../../hooks/useCustomerData";

const UploadCheckout: React.FC<uploadCheckoutProps> = (props) => {
  const [item_GUID, setItem_GUID] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>();
  const [dayOfYear, setDayOfYear] = useState<string>("0");
  const [sayadiCode, setSayadiCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const { data: customerData } = useCustomers(props.parent_GUID);
  const checkPic = useRef<FileUploaderHandle | null>(null);
  const checkConfirmPic = useRef<FileUploaderHandle | null>(null);
  const dispatch = useDispatch();
  const price = useSelector((state: RootState) => state.someFeature.price);
  const qrInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setItem_GUID(uuidv4());
  }, [customerData]);
  useEffect(() => {
    if (qrInputRef.current) {
      qrInputRef.current.focus();
    }
  }, []);
  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        price: price === "" ? "" : price.toString(),
        dueDate: dueDate ? dueDate.format("YYYY/MM/DD") : "",
        dayOfYear: String(dayOfYear),
        sayadiCode: sayadiCode.trim(),
        nationalId: nationalId,
        parentGUID: props.parent_GUID,
        itemGUID: item_GUID,
        SalesExpert: customerData?.["0"]?.SalesExpert || "",
        SalesExpertAcunt_text: customerData?.["0"]?.SalesExpertAcunt_text || "",
      };

      await handleAddItem(data);
      if (checkConfirmPic.current) await checkConfirmPic.current.uploadFile();
      if (checkPic.current) await checkPic.current.uploadFile();
    },
    onSuccess: () => {
      if (checkConfirmPic.current) checkConfirmPic.current.clearFile();
      if (checkPic.current) checkPic.current.clearFile();

      dispatch(setPrice(""));
      setDueDate(null);
      setSayadiCode("");
    },
    onError: (error) => {
      console.error("خطا در ذخیره یا آپلود:", error);
    },
  });
  const formatNumber = (num: number | "") =>
    num === "" ? "" : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const parseNumber = (str: string): number | "" => {
    const cleaned = str.replace(/,/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? "" : parsed;
  };

  const handleQRCodeInput = (value: string) => {
    const fromQR = getLast16Chars(value);
    setSayadiCode(fromQR);
  };

  const handleQRCodeInputForGetNationalId = (value: string) => {
    const fromQR2 = getOwnerNationalId(value);
    if (fromQR2.length === 10) setNationalId(fromQR2);
  };
  function getLast16Chars(str: string) {
    return str.slice(-16);
  }
  // تابعی که از قبل داشتیم برای استخراج شناسه صیادی

  function getOwnerNationalId(str: string) {
    if (!str.includes("IR")) return "";

    const parts = str.split("IR");
    if (parts.length < 2 || parts[0].length < 10) return "";

    const beforeIR = parts[0];
    return beforeIR.slice(-10); // 10 رقم آخر قبل از IR
  }

  return (
    <div className="flex flex-col gap-4 mb-6  p-4 rounded-lg text-base-content">
      {" "}
      <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl flex flex-col gap-6 transition-all duration-300">
        <span className="text-lg font-bold text-base-content border-b border-base-200 pb-2 text-right">
          ثبت چک جدید
        </span>

        {/* شناسه صیادی و کد ملی */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-base-content">
            شناسه صیادی (از QR)
          </label>
          <input
            ref={qrInputRef}
            type="text"
            value={sayadiCode}
            onChange={(e) => {
              handleQRCodeInput(e.target.value);
              handleQRCodeInputForGetNationalId(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            placeholder="اسکن یا وارد کردن کد صیادی"
            className="input input-bordered w-full font-mono text-sm ltr"
          />
          <div className="text-xs text-gray-500 font-medium flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1">
            <span>
              کد ملی صاحب چک: <strong>{nationalId || "-"}</strong>
            </span>
          </div>
        </div>

        {/* تاریخ و مبلغ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-base-content">
              تاریخ سررسید
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={dueDate}
              onChange={(date: DateObject) => {
                setDueDate(date);
                setDayOfYear(String(date.dayOfYear));
              }}
              inputClass="input input-bordered w-full"
              placeholder="تاریخ را انتخاب کنید"
              format="YYYY/MM/DD"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-base-content">
              مبلغ (ریال)
            </label>
            <input
              type="text"
              value={formatNumber(price)}
              onChange={(e) => dispatch(setPrice(parseNumber(e.target.value)))}
              placeholder="مثال: 1,500,000"
              className="input input-bordered w-full font-semibold"
            />
          </div>
        </div>

        {/* آپلود فایل‌ها */}
        <div className="flex flex-col  gap-4 items-stretch">
          <div className="flex-1">
            <FileUploader
              ref={checkPic}
              orderNumber={props.parent_GUID}
              subFolder={item_GUID}
              title="تصویر چک"
              inputId="file-upload-check-pic"
            />
          </div>
          <div className="flex-1">
            <FileUploader
              ref={checkConfirmPic}
              orderNumber={props.parent_GUID}
              subFolder={item_GUID}
              title="رسید ثبت چک"
              inputId="file-upload-check-confirm"
            />
          </div>
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => mutation.mutate()}
            className={`btn w-full ${
              mutation.isPending ? "btn-disabled loading" : "btn-primary"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "در حال ثبت..." : "ثبت چک"}
          </button>
        </div>
      </div>
      {/* <figure className="diff  h-9 aspect-16/9 rounded-xl" tabIndex={0}>
        <div className="diff-item-1" role="img" tabIndex={0}>
          <div className="bg-primary  text-base-100 grid place-content-center text-6xl font-black">
            ZARSIM
          </div>
        </div>
        <div className="diff-item-2" role="img">
          <div className="bg-base-100 text-primary grid place-content-center text-6xl font-black">
            ZARSIM
          </div>
        </div>
        <div className="diff-resizer"></div>
      </figure> */}
    </div>
  );
};

export default UploadCheckout;
