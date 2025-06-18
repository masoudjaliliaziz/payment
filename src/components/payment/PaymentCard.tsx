import type { PaymentType } from "../../api/getData";
import ChecksPreviewItem from "./ChecksPreviewItem";

type Props = { payment: PaymentType };

function PaymentCard({ payment }: Props) {
  return (
    <div className="bg-white p-4 flex flex-col items-center  min-h-screen gap-3 transition-colors duration-500 w-full">
      <div className=" shadow rounded-md p-3 border border-gray-200 mb-3 w-full bg-red-100 flex flex-col justify-center items-end gap-3">
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "مبلغ", data: payment?.price || "—" }}
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
          {" "}
          <ChecksPreviewItem
            title={{ slag: "تاریخ سر رسید", data: payment?.dueDate || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "وضعیت", data: payment?.status || "—" }}
          />
        </div>

        <p>📝 توضیحات: {payment?.agentDescription || "—"}</p>
        <p>
          ❗ دلیل عدم تایید توسط عامل: {payment?.agentUnconfirmReason || "—"}
        </p>
        <p>
          ✅ توضیحات تایید خزانه‌داری:{" "}
          {payment?.treasuryConfirmDescription || "—"}
        </p>
        <p>
          ❌ دلیل عدم تایید خزانه‌داری:{" "}
          {payment?.treasuryUnconfirmReason || "—"}
        </p>
      </div>
    </div>
  );
}

export default PaymentCard;
