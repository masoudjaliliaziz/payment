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

const UploadCheckout: React.FC<uploadCheckoutProps> = (props) => {
  const [item_GUID, setItem_GUID] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>();
  const [dayOfYear, setDayOfYear] = useState<string>("0");

  const [sayadiCode, setSayadiCode] = useState("");

  const [nationalId, setNationalId] = useState("");

  const checkPic = useRef<FileUploaderHandle | null>(null);
  const checkConfirmPic = useRef<FileUploaderHandle | null>(null);
  const dispatch = useDispatch();
  const price = useSelector((state: RootState) => state.someFeature.price);
  const qrInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setItem_GUID(uuidv4());
  }, []);
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
      setNationalId("");
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
    setNationalId(fromQR2);
  };
  function getLast16Chars(str: string) {
    return str.slice(-16);
  }
  // تابعی که از قبل داشتیم برای استخراج شناسه صیادی

  function getOwnerNationalId(str: string) {
    if (!str.includes("IR")) return "";
    const parts = str.split("IR");
    const beforeIR = parts["0"];

    return beforeIR.slice(-10); // 10 رقم آخر قبل از IR
  }

  // function getOwnerNationalId(str: string) {
  //   const removeFirstthreeChar = str.slice(4);
  //   const seprateFromIR = removeFirstthreeChar.split("IR");
  //   const nationalId = seprateFromIR["0"];
  //   return nationalId;
  // }

  return (
    <div className="p-5 w-full max-w-4xl rounded-lg flex flex-col items-center gap-6 mx-auto border-2 border-primary bg-base-300">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-start">
        <div className="flex flex-col w-full gap-2">
          <label className="font-bold text-sm text-base-content">
            شناسه صیادی
          </label>
          <input
            ref={qrInputRef}
            type="text"
            value={sayadiCode}
            onChange={(e) => {
              handleQRCodeInput(e.target.value);
              handleQRCodeInputForGetNationalId(e.target.value);
              e.target.value = ""; // اگر لازم باشه پاک کنی
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            placeholder="اسکن یا وارد کردن کد صیادی"
            className="w-full px-3 py-2 border-2 border-primary rounded-md font-semibold focus:outline-none text-left ltr"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
        <div className="flex flex-col items-start gap-1 flex-grow">
          <label className="font-bold text-sm text-base-content">
            تاریخ سر رسید
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={dueDate}
            onChange={(date: DateObject) => {
              setDueDate(date);
              setDayOfYear(String(date.dayOfYear));
            }}
            inputClass="w-full sm:w-48 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            placeholder="تاریخ را انتخاب کنید"
            format="YYYY/MM/DD"
          />
        </div>
        <div className="flex flex-col items-start gap-1 flex-grow">
          <label className="font-bold text-sm text-base-content">مبلغ</label>
          <div className="flex justify-start items-center gap-3">
            <input
              type="text"
              value={formatNumber(price)}
              onChange={(e) => dispatch(setPrice(parseNumber(e.target.value)))}
              placeholder="مبلغ را وارد کنید"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none font-bold"
            />

            <small className="text-xs text-base-content font-semibold">
              ریال
            </small>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
        <FileUploader
          ref={checkPic}
          orderNumber={props.parent_GUID}
          subFolder={item_GUID}
          title="تصویر چک"
          inputId="file-upload-check-pic"
        />
        <FileUploader
          ref={checkConfirmPic}
          orderNumber={props.parent_GUID}
          subFolder={item_GUID}
          title="تصویر ثبت چک"
          inputId="file-upload-check-confirm"
        />
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
  );
};

export default UploadCheckout;
