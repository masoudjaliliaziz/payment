import Debt from "../components/debt/Debt";
import TestAdd from "../components/TestAdd";
import { useParentGuid } from "../hooks/useParentGuid";

export default function DebtsPage() {
  const guid = useParentGuid();

  return (
    <div className="p-4 space-y-4 relative">
      <div className="bg-base-200 rounded-lg shadow-md p-4">
        <Debt parentGUID={guid} />
      </div>
      <div className="bg-base-200 rounded-lg shadow-md p-4">
        <TestAdd parentGUID={guid} />
      </div>
    </div>
  );
}
