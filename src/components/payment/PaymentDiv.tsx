import { useEffect, useRef, useState } from "react";
import type { PaymentType } from "../../api/getData";
import PaymentCard from "./PaymentCard";
import ModalWrapper from "../ModalWrapper";

type Props = {
  parentGUID: string;
  paymentList: (PaymentType & { dayDiff?: number })[];
};

export default function PaymentDiv({ paymentList, parentGUID }: Props) {
  const [checkColorInfo, setCheckColorInfo] = useState<{
    paymentId: number;
    color: string;
  } | null>(null);

  // 👇 این متغیر اجازه نمی‌ده پاپ‌آپ دوباره نشون داده بشه
  const hasShownPopup = useRef(false);

  useEffect(() => {
    if (hasShownPopup.current) return; // 👈 اگه قبلاً پاپ‌آپ نشون داده شده، هیچی نکن

    const changedPayment = paymentList.find(
      (p) => p.checksColor && p.checksColor !== ""
    );

    if (changedPayment) {
      setCheckColorInfo({
        paymentId: changedPayment.ID,
        color: changedPayment.checksColor!,
      });
      hasShownPopup.current = true; // 👈 فقط یک‌بار اجازه نشون دادن
    }
  }, [paymentList]);

  return (
    <>
      {paymentList.map((p) => (
        <PaymentCard key={p.ID} parentGUID={parentGUID} payment={p} />
      ))}

      <ModalWrapper
        isOpen={!!checkColorInfo}
        onClose={() => setCheckColorInfo(null)}
      >
        <span className="font-bold text-lg mb-4">استعلام رنگ چک</span>

        <div className="flex flex-col gap-2 text-sm bg-slate-100 rounded-md p-3 my-3 justify-start items-start text-right rtl">
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold">وضعیت سفید</span>
            <span className="font-semibold">
              به این معناست که صادرکننده چک فاقد هرگونه سابقه چک برگشتی بوده یا
              در صورت وجود سابقه، تمامی موارد رفع سوء اثر شده است.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-yellow-300 font-bold">وضعیت زرد</span>
            <span className="font-semibold">
              به معنای داشتن یک فقره چک برگشتی یا حداکثر مبلغ 50 میلیون ریال
              تعهد برگشتی است.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-orange-300 font-bold">وضعیت نارنجی</span>
            <span className="font-semibold">
              نشان می‌دهد که صادرکننده چک دارای دو الی چهار فقره چک برگشتی یا
              حداکثر مبلغ 200 میلیون ریال تعهد برگشتی است.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-amber-800 font-bold">وضعیت قهوه‌ای</span>
            <span className="font-semibold">
              از این حکایت دارد که صادرکننده چک دارای پنج تا ده فقره چک برگشتی
              یا حداکثر مبلغ 500 میلیون ریال تعهد برگشتی است.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-red-400 font-bold">وضعیت قرمز</span>
            <span className="font-semibold">
              نیز حاکی از این است که صادرکننده چک دارای بیش از ده فقره چک برگشتی
              یا بیش از مبلغ 500 میلیون ریال تعهد برگشتی است.
            </span>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
