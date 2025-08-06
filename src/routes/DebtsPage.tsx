import Debt from "../components/debt/Debt";
import TestAdd from "../components/TestAdd";
import { useParentGuid } from "../hooks/useParentGuid";

export default function DebtsPage() {
  const guid = useParentGuid();

  return (
    <div className="p-4 space-y-4  overflow-visible">
      {/* حذف کردن container اضافی دور Debt */}
      <Debt parentGUID={guid} />

      <div className="bg-base-200 rounded-lg shadow-md p-4">
        <TestAdd parentGUID={guid} />
      </div>
    </div>
  );
}
