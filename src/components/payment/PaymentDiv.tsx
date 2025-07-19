import type { PaymentType } from "../../api/getData";

import PaymentCard from "./PaymentCard";

type Props = {
  parentGUID: string;
  paymentList: (PaymentType & { dayDiff?: number })[];
};
// const paymentListTest: PaymentType[] = [
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
//   {
//     ID: 1,
//     price: "1000",
//     dayOfYear: "100",
//     agentDescription: "Test Payment 1",
//     agentUnconfirmReason: "aa",
//     dueDate: "1402/01/01",
//     nationalId: "1234567890",
//     parentGUID: "1111111111111111",
//     sayadiCode: "123456789",
//     status: "0",
//     Title: "test payment 1",
//     treasuryConfirmDescription: "hi",
//     treasuryUnconfirmReason: "hello",
//   },
// ];

export default function PaymentDiv({ paymentList, parentGUID }: Props) {
  return (
    <>
      {" "}
      {paymentList.map((p, i) => (
        <PaymentCard index={i} key={p.ID} parentGUID={parentGUID} payment={p} />
      ))}
    </>
  );
}
