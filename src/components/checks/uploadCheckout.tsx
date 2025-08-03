import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import uuidv4 from "../../utils/createGuid";

import { handleAddItem } from "../../api/addData";
import { FileUploader, type FileUploaderHandle } from "./FileUploader";

import { useCustomers } from "../../hooks/useCustomerData";
import { loadPayment, type PaymentType } from "../../api/getData";
import toast from "react-hot-toast";

type Props = {
  parent_GUID: string;
  type: "check" | "cash"; // 👈 نوع فرم
};

const UploadCheckoutForm: React.FC<Props> = ({ parent_GUID, type }) => {
  const [item_GUID, setItem_GUID] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>(null);
  const [dayOfYear, setDayOfYear] = useState<string>("0");
  const [sayadiCode, setSayadiCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [sayadiError, setSayadiError] = useState<string | null>(null);
  const [price, setPriceState] = useState<number | "">("");
  const [bankName, setBankName] = useState<string>("");

  const checkPic = useRef<FileUploaderHandle | null>(null);
  const checkConfirmPic = useRef<FileUploaderHandle | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: customerData } = useCustomers(parent_GUID);

  const { data: paymentList = [] } = useQuery<PaymentType[]>({
    queryKey: ["payments", parent_GUID],
    queryFn: async () => {
      const data = await loadPayment(parent_GUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined
      );
    },
    enabled: !!parent_GUID,
  });

  useEffect(() => {
    setItem_GUID(uuidv4());
  }, [customerData]);

  useEffect(() => {
    if (qrInputRef.current) qrInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!sayadiCode.trim()) {
      setSayadiError(null);
      return;
    }
    if (paymentList.some((p) => p.sayadiCode === sayadiCode.trim())) {
      setSayadiError("این شناسه صیادی قبلاً ثبت شده است.");
    } else {
      setSayadiError(null);
    }
  }, [sayadiCode, paymentList]);

  const validateFields = () => {
    if (type === "check") {
      if (!sayadiCode.trim()) return "شناسه صیادی وارد نشده است.";
      if (sayadiError) return sayadiError;
    }

    if (!nationalId.trim() || nationalId.length !== 10)
      return "کد ملی معتبر وارد نشده است.";
    if (!dueDate) return "تاریخ سررسید انتخاب نشده است.";
    if (!price || price === 0) return "مبلغ وارد نشده است.";

    if (!checkPic.current?.hasFile?.())
      return type === "check"
        ? "تصویر چک الزامی است."
        : "رسید واریز نقدی الزامی است.";

    return null;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const error = validateFields();
      if (error) {
        toast.error(error);
        throw new Error(error);
      }
      let data = {} as {
        price: string;
        dueDate: string;
        nationalId?: string;
        parentGUID: string;
        dayOfYear: string;
        itemGUID: string;
        sayadiCode?: string;
        SalesExpertAcunt_text: string;
        SalesExpert: string;
        status: string;
        cash: string;
        bankName?: string;
      };
      if (type === "check") {
        data = {
          price: price ? price.toString() : "",
          dueDate: dueDate?.format("YYYY/MM/DD") || "",
          dayOfYear,
          sayadiCode: sayadiCode.trim(),
          nationalId,
          parentGUID: parent_GUID,
          itemGUID: item_GUID,
          SalesExpert: customerData?.["0"]?.SalesExpert || "",
          SalesExpertAcunt_text:
            customerData?.["0"]?.SalesExpertAcunt_text || "",
          status: "0",
          cash: "0",
        };
      } else {
        data = {
          price: price ? price.toString() : "",
          dueDate: dueDate?.format("YYYY/MM/DD") || "",
          dayOfYear,

          parentGUID: parent_GUID,
          itemGUID: item_GUID,
          SalesExpert: customerData?.["0"]?.SalesExpert || "",
          SalesExpertAcunt_text:
            customerData?.["0"]?.SalesExpertAcunt_text || "",
          status: "1",
          cash: "1",
          bankName,
        };
      }

      await handleAddItem(data);

      if (type === "check") {
        if (checkPic.current) await checkPic.current.uploadFile();
        if (checkConfirmPic.current?.hasFile?.()) {
          await checkConfirmPic.current.uploadFile();
        }
      }
    },
    onSuccess: () => {
      toast.success("ثبت با موفقیت انجام شد");
      queryClient.invalidateQueries({ queryKey: ["paymentsDraft"] });

      checkPic.current?.clearFile?.();
      checkConfirmPic.current?.clearFile?.();

      setPriceState("");
      setDueDate(null);
      setSayadiCode("");
      setNationalId("");
      setSayadiError(null);
    },
    onError: (error) => {
      toast.error("خطا در ثبت فرم");
      console.error("خطا:", error);
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
    setSayadiCode(getLast16Chars(value));
    const national = getOwnerNationalId(value);
    if (national.length === 10) setNationalId(national);
  };

  function getLast16Chars(str: string) {
    return str.slice(-16);
  }

  function getOwnerNationalId(str: string) {
    if (!str.includes("IR")) return "";
    const parts = str.split("IR");
    if (parts.length < 2 || parts[0].length < 10) return "";
    return parts[0].slice(-10);
  }

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 rounded-lg text-base-content">
      <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl flex flex-col gap-6 transition-all duration-300">
        <span className="text-lg font-bold border-b pb-2 text-right">
          {type === "check" ? "ثبت چک جدید" : "ثبت واریز نقدی"}
        </span>

        {type === "check" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">شناسه صیادی (از QR)</label>
            <input
              ref={qrInputRef}
              type="text"
              value={sayadiCode}
              onChange={(e) => handleQRCodeInput(e.target.value)}
              className={`input input-bordered w-full font-mono text-sm ltr ${
                sayadiError ? "input-error border-red-600" : ""
              }`}
              placeholder="اسکن یا وارد کردن کد صیادی"
            />
            {sayadiError && (
              <span className="text-xs text-red-600">{sayadiError}</span>
            )}
          </div>
        )}

        {type === "cash" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">نام بانک </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">تاریخ سررسید</label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={dueDate}
            onChange={(date: DateObject) => {
              setDueDate(date);
              setDayOfYear(String(date?.dayOfYear ?? 0));
            }}
            inputClass="input input-bordered w-full"
            placeholder="تاریخ را انتخاب کنید"
            format="YYYY/MM/DD"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">مبلغ (ریال)</label>
          <input
            type="text"
            value={formatNumber(price)}
            onChange={(e) => setPriceState(parseNumber(e.target.value))}
            className="input input-bordered w-full font-semibold"
            placeholder="مثال: 1,500,000"
          />
        </div>
        <FileUploader
          ref={checkPic}
          orderNumber={parent_GUID}
          subFolder={item_GUID}
          title={
            type === "check" ? "تصویر چک (الزامی)" : "رسید واریز نقدی (الزامی)"
          }
          inputId="file-upload-check-pic"
        />

        {type === "check" && (
          <div className="flex flex-col gap-4">
            <FileUploader
              ref={checkConfirmPic}
              orderNumber={parent_GUID}
              subFolder={item_GUID}
              title="رسید ثبت چک (اختیاری)"
              inputId="file-upload-check-confirm"
            />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`btn w-full ${
              mutation.isPending ? "btn-disabled loading" : "btn-primary"
            }`}
          >
            {mutation.isPending ? "در حال ثبت..." : "ثبت"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCheckoutForm;
