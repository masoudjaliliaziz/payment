import type { PaymentType } from "../../api/getData";
import ChecksDraftCard from "./ChecksDraftCard";

type Props = {
  parentGUID: string;
  paymentListDraft: (PaymentType & { dayDiff?: number })[];
  selectedPayments: PaymentType[];
  toggleSelect: (p: PaymentType) => void;
};

export default function ChecksDraftDiv({
  paymentListDraft,
  parentGUID,
  selectedPayments,
  toggleSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      {paymentListDraft.map((p) => (
        <ChecksDraftCard
          key={p.ID}
          parentGUID={parentGUID}
          paymentDraft={p}
          selected={selectedPayments.some((sp) => sp.ID === p.ID)}
          toggleSelect={toggleSelect}
        />
      ))}
    </div>
  );
}
