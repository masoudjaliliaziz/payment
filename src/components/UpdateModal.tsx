import React, { useState } from "react";

import type { PaymentType } from "../types/apiTypes";
import { useDeletePayment } from "../hooks/useDeletePayment";
import { useUpdatePayment } from "../hooks/useUpdatePayment";

import ModalWrapper from "./ModalWrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentType & { ID: number };
}

export const UpdateModal: React.FC<Props> = ({ isOpen, onClose, payment }) => {
  const [price, setPrice] = useState(payment.price);
  const [dueDate, setDueDate] = useState(payment.dueDate);

  const deleteMutation = useDeletePayment();
  const updateMutation = useUpdatePayment();

  const handleDelete = () => deleteMutation.mutate(payment.ID);
  const handleUpdate = () =>
    updateMutation.mutate({
      itemId: payment.ID,
      data: { price, dueDate },
    });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">ویرایش یا حذف پرداخت</h3>
      <div className="space-y-4">
        <div>
          <label>مبلغ</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label>تاریخ سررسید</label>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={handleUpdate}
          className="btn btn-success"
          disabled={updateMutation.isPending}
        >
          ذخیره تغییرات
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-error"
          disabled={deleteMutation.isPending}
        >
          حذف
        </button>
      </div>
    </ModalWrapper>
  );
};
