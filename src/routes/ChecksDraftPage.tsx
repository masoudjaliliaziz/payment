import ChecksDraft from "../components/checks/ChecksDraft";
import UploadCheckout from "../components/checks/uploadCheckout";

import { useParentGuid } from "../hooks/useParentGuid";

export default function ChecksDraftPage() {
  const guid = useParentGuid();

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
        <UploadCheckout parent_GUID={guid} />
      </div>
      <div className="col-span-4 bg-base-200 rounded-lg shadow-md">
        <ChecksDraft parentGUID={guid} />
      </div>
    </div>
  );
}
