import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";

type Props = { paymentList: PaymentType[] };

const fakeData: PaymentType[] = [
  {
    price: "1000000",
    dueDate: "1402/01/01",
    serial: "1234567890",
    seri: "A123",
    parentGUID: "fake-guid-123",
    Title: "پرداخت اول",
    status: " حالت انتظار تایید کارشناس",
    agentDescription: "توضیحات کارشناس",
    agentUnconfirmReason: "عدم تطابق اطلاعات",
    treasuryConfirmDescription: "تایید خزانه‌داری",
    treasuryUnconfirmReason: "عدم تایید خزانه‌داری",
  },
];

function PaymentDiv({ paymentList }: Props) {
  return (
    <div
      className="p-4
    flex flex-col items-center justify-center min-h-screen bg-orange-400 gap-3 transition-colors duration-500 w-full"
    >
      {paymentList.length === 0 &&
        fakeData.map((p, i) => <PaymentCard key={i} payment={p} />)}

      {paymentList !== undefined &&
        paymentList.length > 0 &&
        paymentList?.map((p, i) => <PaymentCard key={i} payment={p} />)}
    </div>
  );
}

export default PaymentDiv;
