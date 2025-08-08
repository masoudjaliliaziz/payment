import { useEffect, useRef, useState } from "react";
import { handleQRCodeInput } from "../../utils/handleQrCode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import { formatNumber, parseNumber } from "../../utils/formatNumber";
import { FileUploader, type FileUploaderHandle } from "./FileUploader";
import toast from "react-hot-toast";
import { handleAddItem } from "../../api/addData";
import type { CustomerType } from "../../types/apiTypes";
import { type Dispatch, type SetStateAction } from "react";
import DatePicker from "react-jalali-datepicker";
import moment from "jalali-moment";

type Props = {
  parent_GUID: string;
  customerData: CustomerType[] | undefined;
  itemGUID: string;
  setFormKey: Dispatch<SetStateAction<number>>;
};

function CheckForm({ parent_GUID, customerData, itemGUID, setFormKey }: Props) {
  const [activeTab, setActiveTab] = useState<"hoghoghi" | "haghighi">("haghighi");
  const [price, setPriceState] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dayOfYear, setDayOfYear] = useState<string>("0");
  const [sayadiCode, setSayadiCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [nationalIdHoghoghi, setNationalIdHoghoghi] = useState("");
  const [sayadiError, setSayadiError] = useState<string | null>(null);

  const qrInputRef = useRef<HTMLInputElement>(null);
  const checkPic = useRef<FileUploaderHandle>(null);
  const checkConfirmPic = useRef<FileUploaderHandle>(null);
  const queryClient = useQueryClient();

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

  // محاسبه dayOfYear با jalali-moment
  const calculateDayOfYear = (date: string): number => {
    const jalaliDate = moment(date, "jYYYY/jMM/jDD");
    const startOfYear = moment(jalaliDate).startOf("jYear");
    return jalaliDate.diff(startOfYear, "days") + 1;
  };

  const validateFields = () => {
    if (!sayadiCode.trim()) return "شناسه صیادی وارد نشده است.";
    if (sayadiError) return sayadiError;
    if (!dueDate) return "تاریخ سررسید انتخاب نشده است.";
    if (!price || price === 0) return "مبلغ وارد نشده است.";
    if (!checkPic.current?.hasFile?.()) return "تصویر چک الزامی است.";
    if (activeTab === "haghighi") {
      if (!nationalId.trim()) return "کدملی صاحب چک الزامی است.";
      if (!/^[0-9]{10}$/.test(nationalId)) return "کدملی باید ۱۰ رقم عددی باشد.";
    }
    if (activeTab === "hoghoghi") {
      if (!nationalIdHoghoghi.trim()) return "شناسه ملی شرکت الزامی است.";
      if (!/^[0-9]{11}$/.test(nationalIdHoghoghi)) return "شناسه ملی شرکت باید ۱۱ رقم عددی باشد.";
    }
    return null;
  };

  const mutation = useMutation({
    mutationFn: async ({ itemGUID }: { itemGUID: string }) => {
      const error = validateFields();
      if (error) {
        toast.error(error);
        throw new Error(error);
      }

      const data = {
        price: price.toString(),
        dueDate: dueDate || "", // فرمت jYYYY/jMM/jDD
        dayOfYear,
        sayadiCode: sayadiCode.trim(),
        nationalId: activeTab === "haghighi" ? nationalId : undefined,
        nationalIdHoghoghi: activeTab === "hoghoghi" ? nationalIdHoghoghi : undefined,
        parentGUID: parent_GUID,
        itemGUID,
        SalesExpert: customerData?.[0]?.SalesExpert || "",
        SalesExpertAcunt_text: customerData?.[0]?.SalesExpertAcunt_text || "",
        status: "0",
        cash: "0",
        Verified: activeTab === "haghighi" ? "0" : undefined,
        VerifiedHoghoghi: activeTab === "hoghoghi" ? "0" : undefined,
      };

      await handleAddItem(data);
      await checkPic.current?.uploadFile?.();
      if (checkConfirmPic.current?.hasFile?.()) {
        await checkConfirmPic.current.uploadFile();
      }
    },
    onSuccess: () => {
      toast.success("ثبت با موفقیت انجام شد");
      queryClient.invalidateQueries({ queryKey: ["paymentsDraft"] });
      checkPic.current?.clearFile?.();
      checkConfirmPic.current?.clearFile?.();
      setFormKey((cur) => cur + 1);
      setPriceState("");
      setDueDate(null);
      setSayadiCode("");
      setNationalId("");
      setNationalIdHoghoghi("");
      setSayadiError(null);
    },
    onError: (error) => {
      toast.error("خطا در ثبت فرم");
      console.error("خطا:", error);
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="tabs tabs-boxed w-full flex justify-between items-center gap-1 text-xs font-bold">
        <button
          type="button"
          className={`tab flex-1 py-2 ${
            activeTab === "haghighi" ? "bg-slate-400 text-white" : "bg-slate-200"
          } rounded-md font-black text-xs`}
          onClick={() => setActiveTab("haghighi")}
        >
          شناسه حقیقی
        </button>
        <button
          type="button"
          className={`tab flex-1 py-2 ${
            activeTab === "hoghoghi" ? "bg-slate-400 text-white" : "bg-slate-200"
          } rounded-md font-black text-xs`}
          onClick={() => setActiveTab("hoghoghi")}
        >
          شناسه حقوقی
        </button>
      </div>

      <span className="text-lg font-bold border-b pb-2 text-right">
        ثبت چک جدید
      </span>

      <div className="flex flex-col gap-2 items-end">
        <label className="text-sm font-semibold">کد صیادی</label>
        <input
          ref={qrInputRef}
          type="text"
          value={sayadiCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSayadiCode(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (qrInputRef.current) {
                handleQRCodeInput(
                  qrInputRef.current.value,
                  setSayadiCode,
                  activeTab === "haghighi" ? setNationalId : setNationalIdHoghoghi,
                  activeTab
                );
              }
            }
          }}
          className={`input input-bordered w-full font-mono text-sm ltr ${
            sayadiError ? "input-error border-red-600" : ""
          }`}
          placeholder="اسکن یا وارد کردن کد صیادی"
        />
        {sayadiError && <span className="text-red-600 text-xs">{sayadiError}</span>}
      </div>

      {activeTab === "haghighi" && (
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm font-semibold">کد ملی صاحب چک</label>
          <input
            type="text"
            value={nationalId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNationalId(e.target.value)}
            minLength={10}
            maxLength={10}
            placeholder="مثلاً: 1234567890"
            className="input input-bordered w-full font-mono text-sm ltr"
          />
        </div>
      )}

      {activeTab === "hoghoghi" && (
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm font-semibold">شناسه ملی شرکت</label>
          <input
            type="text"
            value={nationalIdHoghoghi}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNationalIdHoghoghi(e.target.value)}
            minLength={11}
            maxLength={11}
            placeholder="مثلاً: 12345678901"
            className="input input-bordered w-full font-mono text-sm ltr"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 items-end">
        <label className="text-sm font-semibold">مبلغ (ریال)</label>
        <input
          type="text"
          value={formatNumber(price)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceState(parseNumber(e.target.value))}
          className="input input-bordered w-full font-semibold"
          placeholder="مثال: 1,500,000"
        />
      </div>

      <div className="flex flex-col gap-2 items-end">
        <label className="text-sm font-semibold">تاریخ سررسید</label>
        <DatePicker
          value={dueDate}
          onChange={(date: string) => {
            if (date) {
              setDueDate(date);
              setDayOfYear(String(calculateDayOfYear(date)));
            } else {
              setDueDate(null);
              setDayOfYear("0");
            }
          }}
          className="input input-bordered w-full"
          placeholder="تاریخ را انتخاب کنید"
          format="jYYYY/jMM/jDD"
        />
      </div>

      <FileUploader
        ref={checkPic}
        orderNumber={parent_GUID}
        subFolder={itemGUID}
        title="تصویر چک (الزامی)"
        inputId="file-upload-check-pic"
      />

      <FileUploader
        ref={checkConfirmPic}
        orderNumber={parent_GUID}
        subFolder={itemGUID}
        title="رسید ثبت چک (اختیاری)"
        inputId="file-upload-check-confirm"
      />

      <button
        type="button"
        onClick={() => mutation.mutate({ itemGUID })}
        disabled={mutation.isPending}
        className={`btn w-full ${mutation.isPending ? "btn-disabled loading" : "btn-primary"}`}
      >
        {mutation.isPending ? "در حال ثبت..." : "ثبت"}
      </button>
    </div>
  );
}

export default CheckForm;