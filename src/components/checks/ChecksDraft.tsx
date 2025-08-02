import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { loadPaymentDraft, type PaymentType } from "../../api/getData";
import { calculateRasDatePayment } from "../../utils/calculateRasDate";
import { getShamsiDateFromDayOfYear } from "../../utils/getShamsiDateFromDayOfYear";

import ChecksDraftDiv from "./ChecksDraftDiv";
import { handleAddItemToPayment } from "../../api/addData";
import toast from "react-hot-toast";

type Props = {
  parentGUID: string;
};

function ChecksDraft({ parentGUID }: Props) {
  const { data: paymentListDraft = [] } = useQuery<PaymentType[]>({
    queryKey: ["paymentsDraft", parentGUID],
    queryFn: async () => {
      const data = await loadPaymentDraft(parentGUID);
      return (data as (PaymentType | undefined)[])
        .filter((item): item is PaymentType => item !== undefined)
        .filter((item) => item.status === "0"); // ✅ فقط چک‌های با وضعیت 0
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

  const queryClient = useQueryClient();

  const groupMutation = useMutation({
    mutationFn: async () => {
      for (const payment of selectedPayments) {
        const data = {
          price: payment.price.toString(),
          dueDate: payment.dueDate,
          dayOfYear: String(payment.dayOfYear),
          sayadiCode: payment.sayadiCode.trim(),
          nationalId: payment.nationalId,
          parentGUID: payment.parentGUID,
          itemGUID: payment.itemGUID,
          SalesExpert: payment.SalesExpert || "",
          SalesExpertAcunt_text: payment.SalesExpertAcunt_text || "",
        };

        await handleAddItemToPayment(data);
      }
    },
    onSuccess: () => {
      toast.success("تمام چک‌های انتخاب‌شده با موفقیت ثبت شدند");
      setSelectedPayments([]);
      queryClient.invalidateQueries({
        queryKey: ["paymentsDraft", parentGUID],
      });
    },
    onError: () => {
      toast.error("خطا در ثبت گروهی چک‌ها");
    },
  });

  return (
    <div className="flex flex-col h-dvh justify-between items-center gap-0 w-full bg-base-200 rounded-lg">
      <div className="sticky top-0 w-full z-20 p-3 bg-base-100 shadow-sm flex justify-between items-center">
        <div className="bg-info text-white px-4 py-2 rounded-xl text-sm font-bold">
          راس چک‌های انتخابی: {rasDate}
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="btn btn-outline btn-sm  h-[35px]"
            onClick={toggleSelectAll}
          >
            {selectedPayments.length === paymentListDraft.length
              ? "عدم انتخاب همه"
              : "انتخاب همه"}
          </button>

          {selectedPayments.length > 0 && (
            <button
              type="button"
              className={`btn btn-success h-[35px] btn-sm ${
                groupMutation.isPending ? "btn-disabled loading" : ""
              }`}
              onClick={() => groupMutation.mutate()}
              disabled={groupMutation.isPending}
            >
              {groupMutation.isPending
                ? "در حال ثبت چک‌ها..."
                : "ثبت چک‌های انتخاب‌شده"}
            </button>
          )}
        </div>
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
