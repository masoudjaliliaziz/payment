import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";

type Props = { paymentList: (PaymentType & { dayDiff?: number })[] };

const fakeData: (PaymentType & { dayDiff?: number })[] = [
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
    dayOfYear: "21",
    treasuryUnconfirmReason: "عدم تایید خزانه‌داری",
    dayDiff: 0,
  },
  {
    price: "1000000",
    dueDate: "1402/01/01",
    serial: "1234567890",
    seri: "A123",
    parentGUID: "fake-guid-123",
    Title: "پرداخت دوم",
    status: "0",
    agentDescription: "توضیحات کارشناس",
    agentUnconfirmReason: "عدم تطابق اطلاعات",
    treasuryConfirmDescription: "تایید خزانه‌داری",
    treasuryUnconfirmReason: "عدم تایید خزانه‌داری",
    dayOfYear: "45",
    dayDiff: 0,
  },
];

function PaymentDiv({ paymentList }: Props) {
  return (
    <div className="p-4 flex flex-row items-start justify-start min-h-screen gap-3 transition-colors duration-500 w-full">
      {paymentList.length === 0 &&
        fakeData.map((p, i) => <PaymentCard key={i} payment={p} />)}

      {paymentList !== undefined &&
        paymentList.length > 0 &&
        paymentList.map((p, i) => <PaymentCard key={i} payment={p} />)}
    </div>
  );
}

export default PaymentDiv;
