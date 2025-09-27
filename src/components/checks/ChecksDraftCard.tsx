import { useEffect, useState, memo } from "react";
import type { PaymentType } from "../../api/getData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useDeletePaymentDraft } from "../../hooks/useDeleteaymentDraft";
import { handleAddItemToPayment } from "../../api/addData";
import { toast } from "react-toastify";

type Props = {
  parentGUID: string;
  paymentDraft: PaymentType;
  paymentList: PaymentType[]; // Add paymentList as a prop
  selected?: boolean;
  toggleSelect: (p: PaymentType) => void;
};

function ChecksDraftCard({
  parentGUID,
  paymentDraft,
  paymentList,
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

  const mutation = useMutation({
    mutationFn: async () => {
      let data = {};
      if (paymentDraft.cash === "0") {
        if (paymentDraft.VerifiedHoghoghi) {
          data = {
            price:
              paymentDraft.price === "" ? "" : paymentDraft.price.toString(),
            dueDate: paymentDraft.dueDate,
            dayOfYear: String(paymentDraft.dayOfYear),
            sayadiCode: paymentDraft.sayadiCode.trim(),
            nationalIdHoghoghi: paymentDraft.nationalIdHoghoghi,
            parentGUID: paymentDraft.parentGUID,
            itemGUID: paymentDraft.itemGUID,
            SalesExpert: paymentDraft.SalesExpert || "",
            SalesExpertAcunt_text: paymentDraft.SalesExpertAcunt_text || "",
            cash: "0",
          };
        } else {
          data = {
            price:
              paymentDraft.price === "" ? "" : paymentDraft.price.toString(),
            dueDate: paymentDraft.dueDate,
            dayOfYear: String(paymentDraft.dayOfYear),
            sayadiCode: paymentDraft.sayadiCode.trim(),
            nationalId: paymentDraft.nationalId,
            parentGUID: paymentDraft.parentGUID,
            itemGUID: paymentDraft.itemGUID,
            SalesExpert: paymentDraft.SalesExpert || "",
            SalesExpertAcunt_text: paymentDraft.SalesExpertAcunt_text || "",
            cash: "0",
          };
        }
      } else {
        data = {
          price: paymentDraft.price === "" ? "" : paymentDraft.price.toString(),
          dueDate: paymentDraft.dueDate,
          dayOfYear: String(paymentDraft.dayOfYear),
          parentGUID: paymentDraft.parentGUID,
          bankName: paymentDraft.bankName || "",
          cash: "1",
          itemGUID: paymentDraft.itemGUID,
          SalesExpert: paymentDraft.SalesExpert || "",
          SalesExpertAcunt_text: paymentDraft.SalesExpertAcunt_text || "",
        };
      }

      await handleAddItemToPayment(data);
    },
    onSuccess: () => {
      toast.success("چک با موفقیت به پرداخت ها اضافه شد");
    },
    onError: () => {
      toast.error("خطا در افزودن چک به پرداخت ها");
    },
  });

  // Check if any item in paymentList has status="0"
  const hasPendingStatus = paymentList.some(
    (item) => item.status !== "3" && item.status !== "4"
  );

  // 🔒 داده‌های اجباری: اگر ناقص بودن، اصلاً چیزی رندر نشه
  const isValid = paymentDraft.price && paymentDraft.dueDate;

  if (!isValid) return null;

  return (
    <div
      className={`w-full flex flex-col gap-2 p-3 rounded-md cursor-pointer transition-colors duration-300 ${
        selected ? "bg-green-100 border border-green-600" : "bg-white"
      }`}
      onClick={() => toggleSelect(paymentDraft)}
    >
      {paymentDraft.cash === "0" && (
        <div className="flex flex-col items-center justify-center bg-slate-100 gap-2 px-1.5 py-2 rounded-md">
          <div className="bg-slate-200 p-3 rounded-md flex justify-end items-center w-full gap-3">
            {paymentDraft.status === "0" && (
              <button
                type="button"
                className="btn btn-error btn-xs text-white w-[75px] h-[35px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(paymentDraft.ID);
                }}
              >
                <Trash width={16} height={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => mutation.mutate()}
              className={`btn w-[75px] h-[35px] ${
                mutation.isPending || hasPendingStatus
                  ? "btn-disabled "
                  : "btn-primary"
              }`}
              disabled={mutation.isPending || hasPendingStatus}
            >
              {mutation.isPending ? "در حال ثبت..." : "ثبت چک"}
            </button>
          </div>
          <div className="grid grid-cols-4 transition-colors duration-500 w-full">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                تاریخ سررسید
              </p>
              <span className="font-bold text-sky-700 text-sm">
                {paymentDraft.dueDate}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">مبلغ</p>
              <span className="font-bold text-sky-700 text-sm">
                {Number(paymentDraft.price).toLocaleString("fa-IR")}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {paymentDraft.nationalId ? "شناسه حقیقی" : "شناسه حقوقی"}
              </p>
              <span className="font-bold text-sky-700 text-sm">
                {paymentDraft.nationalId
                  ? paymentDraft.nationalId
                  : paymentDraft.nationalIdHoghoghi}
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
      )}
      {paymentDraft.cash === "1" && (
        <div className="flex flex-col items-center justify-center bg-slate-100 gap-2 px-1.5 py-2 rounded-md">
          <div className="bg-slate-200 p-3 rounded-md flex justify-end items-center w-full gap-3">
            <div className="relative group">
              <span className="font-semibold text-info cursor-help">
                واریز نقدی
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 p-3 rounded bg-gray-700 text-white text-xs opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-10">
                <div className="text-center">
                  <div className="font-bold text-sm mb-2 text-blue-300">
                    شماره حساب‌های بانکی
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      1-10706567-110-284
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      1416066538
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      0102171481006
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      3385356379
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      4621823449
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      0109821280001
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      5026100391
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      1019399873
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      177001820893
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      1-42548-40-805
                    </div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-center">
                      1-5008500-2-125
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {paymentDraft.status === "0" && (
              <button
                type="button"
                className="btn btn-error btn-xs text-white w-[75px] h-[35px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(paymentDraft.ID);
                }}
              >
                <Trash width={16} height={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => mutation.mutate()}
              className={`btn w-[75px] h-[35px] ${
                mutation.isPending || hasPendingStatus
                  ? "btn-disabled"
                  : "btn-primary"
              }`}
              disabled={mutation.isPending || hasPendingStatus}
            >
              {mutation.isPending ? "در حال ثبت..." : "ثبت چک"}
            </button>
          </div>
          <div className="grid grid-cols-4 transition-colors duration-500 w-full">
            <div>
              <p className="text-sm font-semibold text-gray-500">تاریخ واریز</p>
              <span className="font-bold text-sky-700 text-sm">
                {paymentDraft.dueDate}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">مبلغ</p>
              <span className="font-bold text-sky-700 text-sm">
                {Number(paymentDraft.price).toLocaleString("fa-IR")}
              </span>
              <span className="font-bold text-gray-700 text-sm">ریال</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">نام بانک</p>
              <div className="relative group">
                <span className="font-bold text-sky-700 text-sm cursor-help">
                  {paymentDraft.bankName}
                </span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 p-3 rounded bg-gray-700 text-white text-xs opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-10">
                  <div className="text-center">
                    <div className="font-bold text-sm mb-2 text-blue-300">
                      شماره حساب‌های بانکی
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        1-10706567-110-284
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        1416066538
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        0102171481006
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        3385356379
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        4621823449
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        0109821280001
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        5026100391
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        1019399873
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        177001820893
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        1-42548-40-805
                      </div>
                      <div className="bg-gray-600 px-2 py-1 rounded text-center">
                        1-5008500-2-125
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ChecksDraftCard);
