import type { PaymentType } from "../../api/getData";

type Props = { payment: PaymentType };

function PaymentCard({ payment }: Props) {
  return (
    <div>
      <div className="bg-base-200 shadow rounded-md p-3 border border-gray-200 mb-3">
        <p>💳 مبلغ: {payment?.price || "—"}</p>
        <p>📅 تاریخ سررسید: {payment?.dueDate || "—"}</p>
        <p>🔢 سریال: {payment?.serial || "—"}</p>
        <p>📌 وضعیت: {payment?.status || "—"}</p>
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
