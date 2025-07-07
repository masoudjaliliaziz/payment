import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";

type Props = {
  parentGUID: string;
  paymentList: (PaymentType & { dayDiff?: number })[];
};

function PaymentDiv({ paymentList, parentGUID }: Props) {
  return (
    <div className="p-4 flex flex-row items-start justify-start min-h-screen gap-3 transition-colors duration-500 w-full">
      {paymentList !== undefined &&
        paymentList.length > 0 &&
        paymentList.map((p) => (
          <PaymentCard parentGUID={parentGUID} key={p.ID} payment={p} />
        ))}
    </div>
  );
}

export default PaymentDiv;
