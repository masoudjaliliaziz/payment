import React, { useState, useEffect, useRef } from "react";
import { FileUploader } from "./FileUploader";
import type { FileUploaderHandle } from "./FileUploader";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import uuidv4 from "../../utils/createGuid";
import type { uploadCheckoutProps } from "./UploadTypes";
import { handleAddItem } from "../../api/addData";

const UploadCheckout: React.FC<uploadCheckoutProps> = (props) => {
  const [item_GUID, setItem_GUID] = useState("");
  const [price, setPrice] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>(null);
  const [serial, setSerial] = useState("");
  const [seri, setSeri] = useState("");

  const checkPic = useRef<FileUploaderHandle | null>(null);
  const checkConfirmPic = useRef<FileUploaderHandle | null>(null);

  useEffect(() => {
    setItem_GUID(uuidv4());
  }, []);

  const onEventAdd = async () => {
    const data = {
      price,
      dueDate: dueDate ? dueDate.format("YYYY/MM/DD") : "",
      serial,
      seri,
      parentGUID: props.parent_GUID,
    };
    console.log(data);

    try {
      await handleAddItem(data);

      if (checkConfirmPic.current) await checkConfirmPic.current.uploadFile();
      if (checkPic.current) await checkPic.current.uploadFile();

      if (checkConfirmPic.current) checkConfirmPic.current.clearFile();
      if (checkPic.current) checkPic.current.clearFile();
    } catch (error) {
      console.error("خطا در ذخیره رویداد یا آپلود فایل:", error);
    }
  };

  return (
    <div className="p-5 w-full max-w-4xl rounded-lg flex flex-col items-center gap-6 mx-auto bg-base-100">
      {/* ورودی سری و سریال */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-start">
        <div className="flex flex-col items-start gap-1 flex-shrink-0">
          <label className="font-bold text-sm">سری</label>
          <input
            type="text"
            value={seri}
            onChange={(e) => setSeri(e.currentTarget.value)}
            className="w-full sm:w-20 px-2 py-1 border-2 border-gray-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="flex flex-col items-start gap-1 flex-grow">
          <label className="font-bold text-sm">سریال</label>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.currentTarget.value)}
            className="w-full sm:w-auto px-2 py-1 border-2 border-gray-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
      </div>

      {/* ورودی تاریخ و قیمت */}
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
        <div className="flex flex-col items-start gap-1 flex-grow">
          <label className="font-bold text-sm">تاریخ</label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={dueDate}
            onChange={(date) => setDueDate(date)}
            inputClass="w-full sm:w-48 px-2 py-1 border-2 border-gray-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600"
            placeholder="تاریخ را انتخاب کنید"
            format="YYYY/MM/DD"
          />
        </div>
        <div className="flex flex-col items-start gap-1 flex-grow">
          <label className="font-bold text-sm">قیمت</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.currentTarget.value)}
            className="w-full sm:w-48 px-2 py-1 border-2 border-gray-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
      </div>

      {/* آپلود فایل‌ها و دکمه */}
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
          onClick={onEventAdd}
          className="bg-gray-800 border-2 text-white font-bold px-5 py-2 rounded-md hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition-colors duration-300 flex-shrink-0"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
};

export default UploadCheckout;
