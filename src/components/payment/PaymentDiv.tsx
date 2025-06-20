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
    status: "0",
    agentDescription: "توضیحات کارشناس",
    agentUnconfirmReason: "عدم تطابق اطلاعات",
    treasuryConfirmDescription: "تایید خزانه‌داری",
    treasuryUnconfirmReason: "عدم تایید خزانه‌داری",
  },
  {
    price: "1000000",
    dueDate: "1402/01/01",
    serial: "1234567890",
    seri: "A123",
    parentGUID: "fake-guid-123",
    Title: "پرداخت اول",
    status: "0",
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
    flex flex-row items-start justify-start min-h-screen  gap-3 transition-colors duration-500 w-full"
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
