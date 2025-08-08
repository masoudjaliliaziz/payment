import React, { useState } from "react";
import UploadCheckoutForm from "./uploadCheckout"; // فرم اصلی رو از اینجا میاریم

type Props = {
  parent_GUID: string;
};

const UploadFormTabs: React.FC<Props> = ({ parent_GUID }) => {
  const [activeTab, setActiveTab] = useState<"check" | "cash">("check");
  const [formKey, setFormKey] = useState<number>(1);
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center  bg-base-100 rounded-lg shadow-md">
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
      />
    </div>
  );
};

export default UploadFormTabs;
