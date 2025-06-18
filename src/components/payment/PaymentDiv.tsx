import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";

type Props = { paymentList: PaymentType[] };

function PaymentDiv({ paymentList }: Props) {
  return (
    <div
      className="p-4
    flex flex-col items-center justify-center min-h-screen bg-base-100 gap-3 transition-colors duration-500"
    >
      {paymentList !== undefined &&
        paymentList.length > 0 &&
        paymentList?.map((p, i) => <PaymentCard key={i} payment={p} />)}
    </div>
  );
}

export default PaymentDiv;
