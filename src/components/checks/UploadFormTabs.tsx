import React, { useState } from "react";
import UploadCheckoutForm from "./uploadCheckout"; // فرم اصلی رو از اینجا میاریم

type Props = {
  parent_GUID: string;
};

const UploadFormTabs: React.FC<Props> = ({ parent_GUID }) => {
  const [activeTab, setActiveTab] = useState<"check" | "cash">("check");

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center gap-3   bg-base-100 rounded-lg shadow-md">
      <div className="tabs tabs-boxed mb-4 p-4 w-full flex justify-between items-center gap-3">
        <button
          type="button"
          className={`tab ${
            activeTab === "check" ? "tab-active" : ""
          } rounded-md`}
          onClick={() => setActiveTab("check")}
        >
          ثبت چک
        </button>
        <button
          type="button"
          className={`tab ${
            activeTab === "cash" ? "tab-active" : ""
          } rounded-md`}
          onClick={() => setActiveTab("cash")}
        >
          واریز نقدی
        </button>
      </div>

      {/* Form Content */}
      <UploadCheckoutForm parent_GUID={parent_GUID} type={activeTab} />
    </div>
  );
};

export default UploadFormTabs;
