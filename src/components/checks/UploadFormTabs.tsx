import React, { useState, useEffect } from "react";
import UploadCheckoutForm from "./uploadCheckout"; // فرم اصلی رو از اینجا میاریم
import { useCustomers } from "../../hooks/useCustomerData";
import Loading from "../Loading";
import { Error } from "../Error";
import InvoiceTypeDropdown from "../InvoiceTypeDropdown";
import PaymentTypeDropdown from "../PaymentTypeDropdown";

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
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md">
      <div className="w-full flex justify-end items-center gap-4 pt-4 pr-4">
        <InvoiceTypeDropdown
          value={typeactiveTab}
          onChange={setTypeActiveTab}
          className="dropdown-end"
        />
        <PaymentTypeDropdown
          value={activeTab}
          onChange={setActiveTab}
          className="dropdown-end"
        />
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
