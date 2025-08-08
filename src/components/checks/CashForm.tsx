import { useMutation, useQueryClient } from "@tanstack/react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import uuidv4 from "../../utils/createGuid";
import { type Dispatch, type SetStateAction } from "react";
import { handleAddItem } from "../../api/addData";
import { FileUploader, type FileUploaderHandle } from "./FileUploader";
import { useState, useEffect, useRef } from "react";

import toast from "react-hot-toast";
import { formatNumber, parseNumber } from "../../utils/formatNumber";
import { bankOptions } from "../../const/BankName";
import type { CustomerType } from "../../types/apiTypes";
type Props = {
  parent_GUID: string;
  itemGUID: string;
  customerData: CustomerType[] | undefined;
  setFormKey: Dispatch<SetStateAction<number>>;
};

function CashForm({ parent_GUID, itemGUID, customerData, setFormKey }: Props) {
  const [priceCash, setPriceCashState] = useState<number | "">("");
  const [dayOfYearCash, setDayOfYearCash] = useState<string>("0");
  const [dueDateCash, setDueDateCash] = useState<DateObject | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const cashPic = useRef<FileUploaderHandle | null>(null);

  const qrInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (qrInputRef.current) qrInputRef.current.focus();
  }, []);

  const validateFields = () => {
    if (!bankName.trim()) return "نام بانک وارد نشده است.";
    if (!dueDateCash) return "تاریخ سررسید انتخاب نشده است.";
    if (!priceCash || priceCash === 0) return "مبلغ وارد نشده است.";

    if (!cashPic.current?.hasFile?.()) return "تصویر رسید نقدی الزامی است.";

    return null;
  };

  const mutation = useMutation({
    mutationFn: async ({ itemGUID }: { itemGUID: string }) => {
      // حالا داخل این تابع از itemGUID جدید استفاده می کنیم
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

      data = {
        price: priceCash ? priceCash.toString() : "",
        dueDate: dueDateCash?.format("YYYY/MM/DD") || "",
        dayOfYear: dayOfYearCash,
        parentGUID: parent_GUID,
        itemGUID,
        SalesExpert: customerData?.["0"]?.SalesExpert || "",
        SalesExpertAcunt_text: customerData?.["0"]?.SalesExpertAcunt_text || "",
        status: "0",
        cash: "1",
        bankName,
      };

      await handleAddItem(data);

      if (cashPic.current) await cashPic.current.uploadFile();
    },
    onSuccess: () => {
      setPriceCashState("");
      setDueDateCash(null);
      setBankName("");
      cashPic.current?.clearFile?.();
      setFormKey((cur) => cur + 1);
      toast.success("ثبت با موفقیت انجام شد");
      queryClient.invalidateQueries({ queryKey: ["paymentsDraft"] });
    },
    onError: (error) => {
      toast.error("خطا در ثبت فرم");
      console.error("خطا:", error);
    },
  });
  return (
    <>
      <>
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm font-semibold">نام بانک مقصد</label>
          <select
            className="select select-bordered w-full text-right"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          >
            <option value="">بانک را انتخاب کنید</option>
            {bankOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm font-semibold">تاریخ واریز</label>
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
        <div className="flex flex-col gap-2 items-end">
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
          subFolder={itemGUID}
          title="تصویر فیش واریزی (الزامی)"
          inputId="file-upload-check-pic"
        />
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              const newItemGUID = uuidv4();
              mutation.mutate({ itemGUID: newItemGUID });
            }}
            disabled={mutation.isPending}
            className={`btn w-full ${
              mutation.isPending ? "btn-disabled loading" : "btn-primary"
            }`}
          >
            {mutation.isPending ? "در حال ثبت..." : "ثبت"}
          </button>
        </div>
      </>
    </>
  );
}

export default CashForm;
