import { useEffect, useState, memo } from "react";
import type { PaymentType } from "../../api/getData";

import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useDeletePaymentDraft } from "../../hooks/useDeleteaymentDraft";

type Props = {
  parentGUID: string;
  paymentDraft: PaymentType;
  selected?: boolean;
  toggleSelect: (p: PaymentType) => void;
};

function ChecksDraftCard({
  parentGUID,
  paymentDraft,
  selected,
  toggleSelect,
}: Props) {
  const deleteMutation = useDeletePaymentDraft(parentGUID);
  const queryClient = useQueryClient();

  const [editData, setEditData] = useState({
    price: paymentDraft.price || "",
    dueDate: paymentDraft.dueDate || "",
  });

  useEffect(() => {
    if (
      paymentDraft.price !== editData.price ||
      paymentDraft.dueDate !== editData.dueDate
    ) {
      setEditData({
        price: paymentDraft.price || "",
        dueDate: paymentDraft.dueDate || "",
      });
    }
  }, [paymentDraft]);

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف اطمینان دارید؟")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paymentsDraft", parentGUID],
          });
        },
      });
    }
  };

  // 🔒 داده‌های اجباری: اگر ناقص بودن، اصلاً چیزی رندر نشه
  const isValid =
    paymentDraft.price &&
    paymentDraft.dueDate &&
    paymentDraft.nationalId &&
    paymentDraft.sayadiCode;

  if (!isValid) return null;

  return (
    <div
      className={`w-full flex flex-col gap-2 p-3 rounded-md cursor-pointer transition-colors duration-300 ${
        selected ? "bg-green-100 border border-green-600" : "bg-white"
      }`}
      onClick={() => toggleSelect(paymentDraft)}
    >
      <div className="flex flex-col items-center justify-center bg-slate-100 gap-2 px-1.5 py-2 rounded-md">
        <div className="bg-slate-200 p-3 rounded-md flex justify-end items-center w-full">
          {paymentDraft.status === "0" && (
            <button
              type="button"
              className="btn btn-error btn-xs text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(paymentDraft.ID);
              }}
            >
              <Trash width={16} height={16} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 transition-colors duration-500 w-full">
          <div>
            <p className="text-sm font-semibold text-gray-500">تاریخ سررسید</p>
            <span className="font-bold text-sky-700 text-sm">
              {paymentDraft.dueDate}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">مبلغ</p>
            <span className="font-bold text-sky-700 text-sm">
              {paymentDraft.price}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              شناسه حقیقی / حقوقی
            </p>
            <span className="font-bold text-sky-700 text-sm">
              {paymentDraft.nationalId}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">شناسه صیادی</p>
            <span className="font-bold text-sky-700 text-sm">
              {paymentDraft.sayadiCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ChecksDraftCard);
