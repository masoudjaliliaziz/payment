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
  const [activeTab, setActiveTab] = useState<"hoghoghi" | "haghighi">(
    "haghighi"
  );
  const [item_GUID, setItem_GUID] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>(null);
  const [dayOfYear, setDayOfYear] = useState<string>("0");
  const [sayadiCode, setSayadiCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [nationalIdHoghoghi, setNationalIdHoghoghi] = useState("");
  const [sayadiError, setSayadiError] = useState<string | null>(null);
  const [price, setPriceState] = useState<number | "">("");
  const [priceCash, setPriceCashState] = useState<number | "">("");
  const [dayOfYearCash, setDayOfYearCash] = useState<string>("0");
  const [dueDateCash, setDueDateCash] = useState<DateObject | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const cashPic = useRef<FileUploaderHandle | null>(null);
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

      if (!dueDate) return "تاریخ سررسید انتخاب نشده است.";
      if (!price || price === 0) return "مبلغ وارد نشده است.";

      if (!checkPic.current?.hasFile?.()) return "تصویر چک الزامی است.";
    }

    if (type === "cash") {
      if (!bankName.trim()) return "نام بانک وارد نشده است.";
      if (!dueDateCash) return "تاریخ سررسید انتخاب نشده است.";
      if (!priceCash || priceCash === 0) return "مبلغ وارد نشده است.";

      if (!cashPic.current?.hasFile?.()) return "تصویر رسید نقدی الزامی است.";
    }

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
        nationalIdHoghoghi?: string;
        parentGUID: string;
        dayOfYear: string;
        itemGUID: string;
        sayadiCode?: string;
        SalesExpertAcunt_text: string;
        SalesExpert: string;
        status: string;
        cash: string;
        bankName?: string;
        Verified?: string;
        VerifiedHoghoghi?: string;
      };
      if (type === "check" && activeTab === "haghighi") {
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
          Verified: "0",
        };
      } else if (type === "check" && activeTab === "hoghoghi") {
        data = {
          price: price ? price.toString() : "",
          dueDate: dueDate?.format("YYYY/MM/DD") || "",
          dayOfYear,
          sayadiCode: sayadiCode.trim(),
          nationalIdHoghoghi,
          parentGUID: parent_GUID,
          itemGUID: item_GUID,
          SalesExpert: customerData?.["0"]?.SalesExpert || "",
          SalesExpertAcunt_text:
            customerData?.["0"]?.SalesExpertAcunt_text || "",
          status: "0",
          cash: "0",
          VerifiedHoghoghi: "0",
        };
      } else {
        data = {
          price: priceCash ? priceCash.toString() : "",
          dueDate: dueDateCash?.format("YYYY/MM/DD") || "",
          dayOfYear: dayOfYearCash,
          parentGUID: parent_GUID,
          itemGUID: item_GUID,
          SalesExpert: customerData?.["0"]?.SalesExpert || "",
          SalesExpertAcunt_text:
            customerData?.["0"]?.SalesExpertAcunt_text || "",
          status: "0",
          cash: "1",
          bankName,
        };
      }

      await handleAddItem(data);
      if (type === "cash") {
        if (cashPic.current) await cashPic.current.uploadFile();
      }

      if (type === "check") {
        if (checkPic.current) await checkPic.current.uploadFile();
        if (checkConfirmPic.current?.hasFile?.()) {
          await checkConfirmPic.current.uploadFile();
        }
      }
    },
    onSuccess: () => {
      if (type === "cash") {
        setPriceCashState("");
        setDueDateCash(null);
        setBankName("");
        cashPic.current?.clearFile?.();
      }

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

  const handleQRCodeInput = (
    e: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    e.preventDefault();
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
          <>
            <div className=" p-4 w-full flex justify-between items-center gap-2 text-xs font-bold">
              <button
                type="button"
                className={`tab ${
                  activeTab === "haghighi" ? "tab-active" : ""
                } rounded-md`}
                onClick={() => setActiveTab("haghighi")}
              >
                با شناسه حقیقی
              </button>
              <button
                type="button"
                className={`tab ${
                  activeTab === "hoghoghi" ? "tab-active" : ""
                } rounded-md`}
                onClick={() => setActiveTab("hoghoghi")}
              >
                با شناسه حقوقی
              </button>
            </div>
            <input
              ref={qrInputRef}
              type="text"
              value={sayadiCode}
              onChange={(e) => handleQRCodeInput(e, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // جلوگیری از رفرش یا ارسال فرم
                }
              }}
              className={`input input-bordered w-full font-mono text-sm ltr ${
                sayadiError ? "input-error border-red-600" : ""
              }`}
              placeholder="اسکن یا وارد کردن کد صیادی"
            />

            {activeTab === "haghighi" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">کد ملی صاحب چک</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setNationalId(e.target.value);
                  }}
                  minLength={10}
                  maxLength={11}
                  placeholder="مثلاً: 1234567890"
                  className="input input-bordered w-full font-mono text-sm ltr"
                />
              </div>
            )}
            {activeTab === "hoghoghi" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold"> شناسه ملی شرکت</label>
                <input
                  type="text"
                  value={nationalIdHoghoghi}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setNationalIdHoghoghi(e.target.value);
                  }}
                  minLength={10}
                  maxLength={11}
                  placeholder="مثلاً: 1234567890"
                  className="input input-bordered w-full font-mono text-sm ltr"
                />
              </div>
            )}
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
            <FileUploader
              ref={checkPic}
              orderNumber={parent_GUID}
              subFolder={item_GUID}
              title="تصویر چک (الزامی)"
              inputId="file-upload-check-pic"
            />
            <div className="flex flex-col gap-4">
              <FileUploader
                ref={checkConfirmPic}
                orderNumber={parent_GUID}
                subFolder={item_GUID}
                title="رسید ثبت چک (اختیاری)"
                inputId="file-upload-check-confirm"
              />
            </div>
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
          </>
        )}

        {type === "cash" && (
          <>
            {" "}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">نام بانک </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">تاریخ سررسید</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={dueDateCash}
                onChange={(date: DateObject) => {
                  setDueDateCash(date);
                  setDayOfYearCash(String(date?.dayOfYear ?? 0));
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
                value={formatNumber(priceCash)}
                onChange={(e) => setPriceCashState(parseNumber(e.target.value))}
                className="input input-bordered w-full font-semibold"
                placeholder="مثال: 1,500,000"
              />
            </div>
            <FileUploader
              ref={cashPic}
              orderNumber={parent_GUID}
              subFolder={item_GUID}
              title="تصویر چک (الزامی)"
              inputId="file-upload-check-pic"
            />
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
          </>
        )}
      </div>
    </div>
  );
};

export default UploadCheckoutForm;
