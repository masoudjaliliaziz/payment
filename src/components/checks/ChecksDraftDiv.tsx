import type { PaymentType } from "../../api/getData";
import ChecksDraftCard from "./ChecksDraftCard";

type Props = {
  parentGUID: string;
  paymentListDraft: (PaymentType & { dayDiff?: number })[];
  paymentList: PaymentType[];
  selectedPayments: PaymentType[];
  toggleSelect: (p: PaymentType) => void;
  typeactiveTab: "1" | "2";
};

export default function ChecksDraftDiv({
  paymentListDraft,
  parentGUID,
  selectedPayments,
  toggleSelect,
  paymentList,
  typeactiveTab,
}: Props) {
  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      {paymentListDraft.map((p) => (
        <ChecksDraftCard
          paymentList={paymentList}
          key={p.ID}
          parentGUID={parentGUID}
          paymentDraft={p}
          selected={selectedPayments.some((sp) => sp.ID === p.ID)}
          toggleSelect={toggleSelect}
          typeactiveTab={typeactiveTab}
        />
      ))}
    </div>
  );
}
