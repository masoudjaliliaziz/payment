import type { PaymentType } from "../../api/getData";
import ChecksPreviewItem from "./ChecksPreviewItem";

import Modal from "./Modal";

type Props = { payment: PaymentType };

function PaymentCard({ payment }: Props) {
  return (
    <div className=" p-4 flex flex-col items-center  min-h-screen gap-3 transition-colors duration-500 w-full">
      <div className=" shadow rounded-md py-5 px-4  border-primary border-2 mb-3 w-full  flex flex-col justify-center items-end gap-3 bg-base-300">
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "مبلغ", data: payment?.price || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "تاریخ سر رسید", data: payment?.dueDate || "—" }}
          />

          <div className=" flex gap-3 flex-row-reverse">
            <ChecksPreviewItem
              title={{ slag: "سریال", data: payment?.serial || "—" }}
            />
            <ChecksPreviewItem
              title={{ slag: "سری", data: payment?.seri || "—" }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <div className=" flex justify-end items-center gap-3 ">
            <Modal
              id="agent-description-modal"
              title={{
                slag: "توضیحات کارشناس",
                data: payment?.agentDescription || "توضیحاتی درج نشده",
              }}
            />
            <Modal
              id="treasury-confirm-description-modal"
              title={{
                slag: "توضیحات خزانه‌داری",
                data:
                  payment?.treasuryConfirmDescription || "توضیحاتی درج نشده",
              }}
            />
          </div>{" "}
          <ChecksPreviewItem
            title={{ slag: "وضعیت", data: payment?.status || "—" }}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
