import { useState } from "react";
import ChecksDraft from "../components/checks/ChecksDraft";
import UploadFormTabs from "../components/checks/UploadFormTabs";
import { useParentGuid } from "../hooks/useParentGuid";

export default function ChecksDraftPage() {
  const guid = useParentGuid();
  const [typeactiveTab, setTypeActiveTab] = useState<"1" | "2">("1");
  const [customerCode, setCustomerCode] = useState<string>("");
  const [customerTitle, setCustomerTitle] = useState<string>("");

  if (!guid) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        در حال بارگذاری اطلاعات فرم...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 p-4 w-full mx-auto">
      <div className="col-span-1">
        <UploadFormTabs
          parent_GUID={guid}
          typeactiveTab={typeactiveTab}
          setTypeActiveTab={setTypeActiveTab}
          onCustomerDataChange={(code, title) => {
            setCustomerCode(code);
            setCustomerTitle(title);
          }}
        />
      </div>
      <div className="col-span-4 bg-base-200 rounded-lg shadow-md">
        <ChecksDraft
          parentGUID={guid}
          typeactiveTab={typeactiveTab}
          customerCode={customerCode}
          customerTitle={customerTitle}
        />
      </div>
    </div>
  );
}
