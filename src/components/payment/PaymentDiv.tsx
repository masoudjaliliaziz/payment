import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";

type Props = { paymentList: (PaymentType & { dayDiff?: number })[] };

function PaymentDiv({ paymentList }: Props) {
  return (
    <div className="p-4 flex flex-row items-start justify-start min-h-screen gap-3 transition-colors duration-500 w-full">
      {paymentList !== undefined &&
        paymentList.length > 0 &&
        paymentList.map((p, i) => <PaymentCard key={i} payment={p} />)}
    </div>
  );
}

export default PaymentDiv;
