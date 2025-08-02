import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { loadPaymentDraft, type PaymentType } from "../../api/getData";
import { calculateRasDatePayment } from "../../utils/calculateRasDate";
import { getShamsiDateFromDayOfYear } from "../../utils/getShamsiDateFromDayOfYear";

import ChecksDraftDiv from "./ChecksDraftDiv";

type Props = {
  parentGUID: string;
};

function ChecksDraft({ parentGUID }: Props) {
  const { data: paymentListDraft = [] } = useQuery<PaymentType[]>({
    queryKey: ["paymentsDraft", parentGUID],
    queryFn: async () => {
      const data = await loadPaymentDraft(parentGUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 3000,
  });

  const [selectedPayments, setSelectedPayments] = useState<PaymentType[]>([]);

  const toggleSelect = (payment: PaymentType) => {
    setSelectedPayments((prev) => {
      const exists = prev.some((p) => p.ID === payment.ID);
      if (exists) return prev.filter((p) => p.ID !== payment.ID);
      return [...prev, payment];
    });
  };

  const toggleSelectAll = () => {
    if (selectedPayments.length === paymentListDraft.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(paymentListDraft);
    }
  };

  const rasDayOfYear = calculateRasDatePayment(selectedPayments);
  const rasDate = rasDayOfYear ? getShamsiDateFromDayOfYear(rasDayOfYear) : "—";

  return (
    <div className="flex flex-col h-dvh justify-between items-center gap-0 w-full bg-base-200 rounded-lg">
      {/* Sticky header with Ras Date & Select All */}
      <div className="sticky top-0 w-full z-20 p-3 bg-base-100 shadow-sm flex justify-between items-center">
        <div className="bg-info text-white px-4 py-2 rounded-xl text-sm font-bold">
          راس چک‌های انتخابی: {rasDate}
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={toggleSelectAll}
        >
          {selectedPayments.length === paymentListDraft.length
            ? "عدم انتخاب همه"
            : "انتخاب همه"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-4 py-6">
        {paymentListDraft.length > 0 && (
          <ChecksDraftDiv
            parentGUID={parentGUID}
            paymentListDraft={paymentListDraft}
            selectedPayments={selectedPayments}
            toggleSelect={toggleSelect}
          />
        )}
      </div>
    </div>
  );
}

export default ChecksDraft;
