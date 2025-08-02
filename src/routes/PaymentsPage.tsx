import UploadCheckout from "../components/checks/uploadCheckout";
import Payment from "../components/payment/Payment";
import { useParentGuid } from "../hooks/useParentGuid";

export default function PaymentsPage() {
  const guid = useParentGuid();

  return (
    <div className="grid grid-cols-5 gap-4 p-4 w-full mx-auto ">
      <div className="col-span-1">
        <UploadCheckout parent_GUID={guid} />
      </div>
      <div className="col-span-4 bg-base-200 rounded-lg shadow-md ">
        <Payment parentGUID={guid} />
      </div>
    </div>
  );
}
