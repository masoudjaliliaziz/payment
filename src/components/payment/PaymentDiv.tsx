import type { PaymentType } from "../../api/getData";

import PaymentCard from "./PaymentCard";

type Props = {
  parentGUID: string;
  paymentList: (PaymentType & { dayDiff?: number })[];
};

export default function PaymentDiv({ paymentList, parentGUID }: Props) {
  return (
    <div className="p-4 flex flex-row items-start justify-start min-h-screen gap-3 transition-colors duration-500 w-full">
      {paymentList.map((p) => (
        <PaymentCard key={p.ID} parentGUID={parentGUID} payment={p} />
      ))}
    </div>
  );
}
