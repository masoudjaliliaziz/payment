import type { PaymentType } from "../../api/getData";
import ChecksPreviewItem from "./ChecksPreviewItem";
import Modal from "./Modal";

type Props = { payment: PaymentType & { dayDiff?: number } };

function PaymentCard({ payment }: Props) {
  // رنگ اختلاف روز بر اساس مثبت یا منفی بودن
  const getDayDiffColor = () => {
    if (payment.dayDiff == null) return "text-base-content";
    if (payment.dayDiff > 0) return "text-success";
    if (payment.dayDiff < 0) return "text-error";
    return "text-warning";
  };

  return (
    <div className="p-4 flex flex-col items-center gap-3 transition-colors duration-500 w-[33%]">
      <div className="shadow rounded-md py-5 px-4 border-primary border-2 mb-3 w-full flex flex-col justify-center items-end gap-3 bg-base-300">
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "سریال", data: payment?.serial || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "سری", data: payment?.seri || "—" }}
          />
        </div>

        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "مبلغ", data: payment?.price || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "تاریخ سر رسید", data: payment?.dueDate || "—" }}
          />
        </div>

        <ChecksPreviewItem
          title={{ slag: "وضعیت", data: payment?.status || "—" }}
        />

        {/* ✅ نمایش اختلاف روز */}
        {payment.dayDiff !== undefined && (
          <div className={`font-bold ${getDayDiffColor()}`}>
            اختلاف با سررسید: {payment.dayDiff} روز
          </div>
        )}

        <div className="flex justify-between items-center w-full flex-row-reverse">
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
              data: payment?.treasuryConfirmDescription || "توضیحاتی درج نشده",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
