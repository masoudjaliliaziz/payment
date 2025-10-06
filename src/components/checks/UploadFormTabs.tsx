import React, { useState, useEffect } from "react";
import UploadCheckoutForm from "./uploadCheckout"; // فرم اصلی رو از اینجا میاریم
import { useCustomers } from "../../hooks/useCustomerData";
import Loading from "../Loading";
import { Error } from "../Error";

type Props = {
  parent_GUID: string;
  typeactiveTab: "1" | "2";
  setTypeActiveTab: (value: "1" | "2") => void;
  onCustomerDataChange?: (customerCode: string, customerTitle: string) => void;
};

const UploadFormTabs: React.FC<Props> = ({
  parent_GUID,
  typeactiveTab,
  setTypeActiveTab,
  onCustomerDataChange,
}) => {
  const {
    isLoading,
    data: customerData,
    isError,
    error,
  } = useCustomers(parent_GUID);
  const [activeTab, setActiveTab] = useState<"check" | "cash">("check");
  const [formKey, setFormKey] = useState<number>(1);

  // ارسال اطلاعات مشتری به کامپوننت والد
  useEffect(() => {
    if (customerData && customerData.length > 0 && onCustomerDataChange) {
      const customer = customerData[0];
      onCustomerDataChange(customer.CustomerCode || "", customer.Title || "");
    }
  }, [customerData, onCustomerDataChange]);

  if (isLoading) {
    return <Loading title="در حال بارگذاری..." />;
  }
  if (isError) {
    console.error(error);
    return <Error title="خطا در بارگذاری داده" />;
  }
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center  bg-base-100 rounded-lg shadow-md">
      <div className="tabs tabs-boxed   w-full flex justify-end items-center gap-3 pt-3 pr-3">
        <button
          type="button"
          className={`tab ${
            typeactiveTab === "1" ? "bg-slate-400 text-white" : ""
          } rounded-md   bg-slate-200 font-black text-xs`}
          onClick={() => setTypeActiveTab("1")}
        >
          فاکتور نوع ۱
        </button>
        <button
          type="button"
          className={`tab ${
            typeactiveTab === "2" ? "bg-slate-400" : ""
          } rounded-md   bg-slate-200 font-black text-xs`}
          onClick={() => setTypeActiveTab("2")}
        >
          فاکتور نوع ۲
        </button>
      </div>

      <div className="tabs tabs-boxed   w-full flex justify-end items-center gap-3 pt-3 pr-3">
        <button
          type="button"
          className={`tab ${
            activeTab === "check" ? "bg-slate-400 text-white" : ""
          } rounded-md   bg-slate-200 font-black text-xs`}
          onClick={() => setActiveTab("check")}
        >
          ثبت چک
        </button>
        <button
          type="button"
          className={`tab ${
            activeTab === "cash" ? "bg-slate-400" : ""
          } rounded-md   bg-slate-200 font-black text-xs`}
          onClick={() => setActiveTab("cash")}
        >
          واریز نقدی
        </button>
      </div>

      {/* Form Content */}
      <UploadCheckoutForm
        formKey={formKey}
        setFormKey={setFormKey}
        parent_GUID={parent_GUID}
        type={activeTab}
        typeactiveTab={typeactiveTab}
        setTypeActiveTab={setTypeActiveTab}
        customerData={customerData ?? []}
      />
    </div>
  );
};

export default UploadFormTabs;
