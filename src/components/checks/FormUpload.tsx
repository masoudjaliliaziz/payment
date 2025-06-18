import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { handleAddItem } from "../../api/addData";

async function handleOnTest() {
  await handleAddItem({
    dueDate: "1402/07/01",
    parentGUID: "tttttttttttttt",
    price: "1000000",
    serial: "1234567890",
    seri: "1234567890",
  });
}

const FormUpload = () => {
  const [seri, setSeri] = useState("");
  const [serial, setSerial] = useState("");
  const [dueDate, setDueDate] = useState<DateObject | null>(null); // مقدار اولیه null یا DateObject
  const [price, setPrice] = useState("");

  const handleSeriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeri(e.currentTarget.value);
  };

  return (
    <div>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={dueDate}
        onChange={(date) => setDueDate(date)} // موقع تغییر تاریخ اینجا state رو آپدیت کن
        placeholder="تاریخ را انتخاب کنید"
        inputClass="my-input-class" // می‌تونی کلاس دلخواه بزنی یا حذف کنی
      />

      <button
        onClick={() => {
          handleOnTest();
        }}
      >
        click me
      </button>
      <div>
        <p>سری</p>
        <input type="text" value={seri} onChange={handleSeriChange} />
      </div>
      <div>
        <p>سریال</p>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.currentTarget.value)}
        />
      </div>
      <div>
        <p>قیمت</p>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default FormUpload;
