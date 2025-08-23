import { useState, useEffect, memo } from "react";
import type { PaymentType } from "../../api/getData";
import { useDeletePayment } from "../../hooks/useDeletePayment";
import { useUpdatePayment } from "../../hooks/useUpdatePayment";

import Modal from "./Modal";
import ModalWrapper from "../ModalWrapper";
import { useQueryClient } from "@tanstack/react-query";

import { Trash } from "lucide-react";
import { getBankNameFromIBAN } from "../../utils/getBankNameFromIban";

type Props = {
  parentGUID: string;
  payment: PaymentType & { dayDiff?: number };
};

function PaymentCard({ parentGUID, payment }: Props) {
  const updateMutation = useUpdatePayment(parentGUID);
  const deleteMutation = useDeletePayment(parentGUID);
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    price: payment.price || "",
    dueDate: payment.dueDate || "",
  });

  useEffect(() => {
    if (
      payment.price !== editData.price ||
      payment.dueDate !== editData.dueDate
    ) {
      setEditData({
        price: payment.price || "",
        dueDate: payment.dueDate || "",
      });
    }
  }, [payment]);

  const getCheckColor = (colorCode: string | undefined) => {
    const colorMap: Record<string, string> = {
      "1": "bg-white border border-1 border-black",
      "2": "bg-yellow-300",
      "3": "bg-orange-300",
      "4": "bg-amber-800",
      "5": "bg-red-400",
    };
    return colorMap[colorCode ?? ""] ?? "bg-gray-500 border border-gray-700";
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف اطمینان دارید؟")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["payments", parentGUID] });
        },
      });
    }
  };

  const handleUpdate = () => {
    if (!editData.price || !editData.dueDate) {
      alert("مبلغ و تاریخ سررسید نمی‌توانند خالی باشند.");
      return;
    }

    if (isNaN(Number(editData.price))) {
      alert("مبلغ باید عدد باشد.");
      return;
    }

    updateMutation.mutate(
      {
        itemId: payment.ID,
        data: editData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["payments", parentGUID] });
          setIsEditModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-2 p-3 rounded-md bg-white">
      {payment.cash == "0" && (
        <>
          {" "}
          <div className="flex items-center justify-end bg-slate-100 gap-2 px-1.5 py-2 rounded-md">
            {payment.status === "0" && (
              <button
                type="button"
                className="btn btn-error btn-xs text-white"
                onClick={() => handleDelete(payment.ID)}
              >
                <Trash width={16} height={16} />
              </button>
            )}
            <Modal
              id={`agent-description-modal-${payment.ID}`}
              title={{
                slag: "توضیحات کارشناس",
                data: payment?.agentDescription || "توضیحاتی درج نشده",
              }}
            />
            <Modal
              id={`treasury-confirm-description-modal-${payment.ID}`}
              title={{
                slag: "توضیحات خزانه‌داری",
                data:
                  payment?.treasuryConfirmDescription || "توضیحاتی درج نشده",
              }}
            />

            <div>
              <div className="flex gap-1 items-center">
                {Array.from({ length: Number(payment.checksColor) }, (_, i) => (
                  <span
                    key={i}
                    className={`rounded-sm w-3 h-3 ${getCheckColor(
                      payment.checksColor
                    )}`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 transition-colors duration-500 w-full">
            <div>
              <p className="text-sm font-semibold text-gray-500"> سری </p>
              {payment?.seriesNo !== null &&
              payment?.seriesNo !== undefined &&
              payment?.seriesNo !== "" ? (
                <span className="font-bold text-sky-700 text-sm">
                  {payment?.seriesNo || "نامشخص"}
                </span>
              ) : (
                <span>نامشخص</span>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> سریال</p>
              <span className="font-bold text-sky-700 text-sm">
                {payment?.serialNo !== null &&
                payment?.serialNo !== undefined &&
                payment?.serialNo !== "" ? (
                  <span className="font-bold text-sky-700 text-sm">
                    {payment?.serialNo || "نامشخص"}
                  </span>
                ) : (
                  <span>نامشخص</span>
                )}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                {" "}
                نام صاحب چک{" "}
              </p>
              <span className="font-bold text-sky-700 text-sm">
                {payment?.name !== null &&
                payment?.name !== undefined &&
                payment?.name !== "" ? (
                  <span className="font-bold text-sky-700 text-sm">
                    {payment?.name || "نامشخص"}
                  </span>
                ) : (
                  <span>نامشخص</span>
                )}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                {" "}
                تاریخ سررسید{" "}
              </p>
              <span className="font-bold text-sky-700 text-sm">
                {payment?.dueDate || "نامشخص"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> مبلغ </p>
              <span className="font-bold text-sky-700 text-sm">
                {Number(payment?.price).toLocaleString("fa-IR")}
              </span>
              <span className="text-base-content text-xs">ریال</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> بانک </p>

              {payment?.iban !== null &&
              payment?.iban !== undefined &&
              payment?.iban !== "" ? (
                <span className="font-bold text-sky-700 text-sm">
                  {getBankNameFromIBAN(payment?.iban)}
                </span>
              ) : (
                <span>نامشخص</span>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> وضعیت </p>
              <span
                className={`font-bold  text-sm ${
                  payment.status === "0"
                    ? "text-warning"
                    : payment.status === "1"
                    ? "text-info"
                    : payment.status === "2"
                    ? "text-error"
                    : payment.status === "3"
                    ? "text-error"
                    : payment.status === "4"
                    ? "text-success"
                    : "text-sky-800"
                }`}
              >
                {payment.status === "0"
                  ? "در انتظار تایید کارشناس"
                  : payment.status === "1"
                  ? "در انتظار تایید خزانه "
                  : payment.status === "2"
                  ? "رد شده توسط کارشناس"
                  : payment.status === "3"
                  ? "رد شده توسط خزانه"
                  : payment.status === "4"
                  ? "تایید نهایی"
                  : "نامشخص"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> شماره شبا </p>

              {payment?.iban !== null &&
              payment?.iban !== undefined &&
              payment?.iban !== "" ? (
                <span className="font-bold text-sky-700 text-sm">
                  {payment?.iban || "نامشخص"}
                </span>
              ) : (
                <span>نامشخص</span>
              )}
            </div>

            <ModalWrapper
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
            >
              <h3 className="font-bold text-lg mb-4">ویرایش پرداخت</h3>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col">
                  مبلغ
                  <input
                    type="text"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="input input-bordered"
                  />
                </label>

                <label className="flex flex-col">
                  تاریخ سررسید
                  <input
                    type="text"
                    value={editData.dueDate}
                    onChange={(e) =>
                      setEditData({ ...editData, dueDate: e.target.value })
                    }
                    className="input input-bordered"
                  />
                </label>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdate}
                >
                  ذخیره تغییرات
                </button>
              </div>
            </ModalWrapper>

            {/* Popup for check color change */}
          </div>
        </>
      )}

      {payment.cash === "1" && (
        <>
          <div className="flex items-center justify-end bg-slate-100 gap-2 px-1.5 py-2 rounded-md">
            {payment.status === "0" && (
              <button
                type="button"
                className="btn btn-error btn-xs text-white"
                onClick={() => handleDelete(payment.ID)}
              >
                <Trash width={16} height={16} />
              </button>
            )}
            <Modal
              id={`agent-description-modal-${payment.ID}`}
              title={{
                slag: "توضیحات کارشناس",
                data: payment?.agentDescription || "توضیحاتی درج نشده",
              }}
            />
            <Modal
              id={`treasury-confirm-description-modal-${payment.ID}`}
              title={{
                slag: "توضیحات خزانه‌داری",
                data:
                  payment?.treasuryConfirmDescription || "توضیحاتی درج نشده",
              }}
            />
            <div>
              <span className="font-bold text-sky-700 text-sm">
                پرداخت نقدی
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 transition-colors duration-500 w-full">
            <div>
              <p className="text-sm font-semibold text-gray-500"> وضعیت </p>
              <span
                className={`font-bold  text-sm ${
                  payment.status === "0"
                    ? "text-warning"
                    : payment.status === "1"
                    ? "text-info"
                    : payment.status === "2"
                    ? "text-error"
                    : payment.status === "3"
                    ? "text-error"
                    : payment.status === "4"
                    ? "text-success"
                    : "text-sky-800"
                }`}
              >
                {payment.status === "0"
                  ? "در انتظار تایید کارشناس"
                  : payment.status === "1"
                  ? "در انتظار تایید خزانه "
                  : payment.status === "2"
                  ? "رد شده توسط کارشناس"
                  : payment.status === "3"
                  ? "رد شده توسط خزانه"
                  : payment.status === "4"
                  ? "تایید نهایی"
                  : "نامشخص"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">تاریخ واریز</p>
              <span className="font-bold text-sky-700 text-sm">
                {payment?.dueDate || "نامشخص"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500"> مبلغ </p>
              <span className="font-bold text-sky-700 text-sm">
                {Number(payment?.price).toLocaleString("fa-IR") || "نامشخص"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                واریز به بانک
              </p>
              <span className="font-bold text-sky-700 text-sm">
                {payment?.bankName || "نامشخص"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(PaymentCard);
