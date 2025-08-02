import Payment from "../components/payment/Payment";
import { useParentGuid } from "../hooks/useParentGuid";

export default function PaymentsPage() {
  const guid = useParentGuid();

  return (
    <div className="gap-4 p-4 w-full mx-auto ">
      <div className="col-span-4 bg-base-200 rounded-lg shadow-md ">
        <Payment parentGUID={guid} />
      </div>
    </div>
  );
}
