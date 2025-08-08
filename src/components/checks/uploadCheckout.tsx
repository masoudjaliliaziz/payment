import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import CheckForm from "./CheckForm";
import { useCustomers } from "../../hooks/useCustomerData";
import uuidv4 from "../../utils/createGuid";
import CashForm from "./CashForm";

type Props = {
  parent_GUID: string;
  formKey: number;
  setFormKey: Dispatch<SetStateAction<number>>;
  type: "check" | "cash"; // 👈 نوع فرم
};

const UploadCheckoutForm: React.FC<Props> = ({
  parent_GUID,
  type,
  formKey,
  setFormKey,
}) => {
  const { data: customerData } = useCustomers(parent_GUID);
  const [itemGUID, setItemGUID] = useState("");
  useEffect(() => {
    setItemGUID(uuidv4());
  }, [formKey]);
  return (
    <div className="flex flex-col gap-4 mb-6 p-4 rounded-lg text-base-content">
      <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl flex flex-col gap-6 transition-all duration-300">
        {type === "check" && (
          <CheckForm
            setFormKey={setFormKey}
            customerData={customerData}
            itemGUID={itemGUID}
            parent_GUID={parent_GUID}
            key={uuidv4()}
          />
        )}

        {type === "cash" && (
          <CashForm
            setFormKey={setFormKey}
            customerData={customerData}
            itemGUID={itemGUID}
            parent_GUID={parent_GUID}
            key={uuidv4()}
          />
        )}
      </div>
    </div>
  );
};

export default UploadCheckoutForm;
