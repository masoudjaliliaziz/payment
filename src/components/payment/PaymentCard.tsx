import { useState, useEffect, memo } from "react";
import type { PaymentType } from "../../api/getData";
import { useDeletePayment } from "../../hooks/useDeletePayment";
import { useUpdatePayment } from "../../hooks/useUpdatePayment";
import ChecksPreviewItem from "./ChecksPreviewItem";
import Modal from "./Modal";
import ModalWrapper from "../ModalWrapper";
import { useQueryClient } from "@tanstack/react-query";
import {
  // getCheckColors,
  getSayadInquiry,
  getSayadToken,
} from "../../api/getToken";
import type { SayadiResultType } from "../../types/apiTypes";
import { useCheckColor } from "../../hooks/useCheckColor";
import { Trash } from "lucide-react";
import { updateCustomerItemByGuid } from "../../api/updateData";

type Props = {
  parentGUID: string;
  payment: PaymentType & { dayDiff?: number };
  index: number; // 🆕
};

function PaymentCard({ parentGUID, payment, index }: Props) {
  const updateMutation = useUpdatePayment(parentGUID);
  const deleteMutation = useDeletePayment(parentGUID);
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    price: payment.price || "",
    dueDate: payment.dueDate || "",
  });

  const [sayadiData, setSayadiData] = useState<SayadiResultType>();

  const { colorData } = useCheckColor(payment.nationalId);
  // همگام سازی editData با تغییر props.payment
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
  }, [editData.dueDate, editData.price, payment]);

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

  useEffect(() => {
    async function getSayadInquery() {
      // ساخت trackId رندوم هر بار
      const trackId = Math.floor(Math.random() * 1_000_000_000).toString();
      try {
        const token = await getSayadToken("credit:sayad-serial-inquiry:get");

        const getSayadIdentify = await getSayadInquiry(
          payment.sayadiCode,
          token,
          trackId
        );
        setSayadiData(getSayadIdentify);
        await updateCustomerItemByGuid(parentGUID, {
          iban: sayadiData?.iban,
          branchCode: sayadiData?.branchCode,
          name: sayadiData?.name,
          serialNo: sayadiData?.serialNo,
          seriesNo: sayadiData?.seriesNo,
        });
      } catch (error) {
        console.error("خطا در دریافت اطلاعات صیادی:", error);
      }
    }

    getSayadInquery();
  }, [
    parentGUID,
    payment.sayadiCode,
    sayadiData?.branchCode,
    sayadiData?.iban,
    sayadiData?.name,
    sayadiData?.serialNo,
    sayadiData?.seriesNo,
  ]);

  // رنگ اختلاف روز بر اساس مثبت یا منفی بودن
  const getDayDiffColor = () => {
    if (payment.dayDiff == null) return "text-base-content";
    if (payment.dayDiff > 0) return "text-success";
    if (payment.dayDiff < 0) return "text-error";
    return "text-warning";
  };

  return (
    <div
      className={` flex flex-col items-center  transition-colors duration-500 w-full ${
        index % 2 === 0 ? "bg-base-300" : "bg-base-100"
      }`}
    >
      <div
        className={`shadow-md rounded-md py-5 px-4   w-full flex flex-col justify-center items-end gap-1 `}
      >
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "شناسه صیادی", data: payment?.sayadiCode || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "سری ", data: sayadiData?.seriesNo || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: " سریال", data: sayadiData?.serialNo || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "نام صاحب چک", data: sayadiData?.name || "—" }}
          />
        </div>
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "تاریخ سر رسید", data: payment?.dueDate || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: " مبلغ", data: payment?.price || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "وضعیت", data: payment?.status || "—" }}
          />
        </div>
        <div className="flex justify-between items-center w-full flex-row-reverse">
          {" "}
        </div>

        {/* نمایش اختلاف روز */}
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
              data: payment?.agentUnconfirmReason || "توضیحاتی درج نشده",
            }}
          />
          <Modal
            id="treasury-confirm-description-modal"
            title={{
              slag: "توضیحات خزانه‌داری",
              data: payment?.treasuryUnconfirmReason || "توضیحاتی درج نشده",
            }}
          />

          <ChecksPreviewItem
            title={{
              slag: " استعلام رنگ چک",
              data: colorData?.chequeColor || "—",
            }}
          />
          <div
            className={`w-5 h-5 rounded-full ${
              colorData?.chequeColor === "1"
                ? "bg-base-300"
                : colorData?.chequeColor === "2"
                ? "bg-yellow-400"
                : colorData?.chequeColor === "3"
                ? "bg-orange-400"
                : colorData?.chequeColor === "4"
                ? "bg-amber-950"
                : colorData?.chequeColor === "5"
                ? "bg-red-500"
                : "bg-gray-500 border-2 border-base-content"
            }`}
          ></div>
          {payment.status === "0" && (
            <div className="flex justify-end gap-2 ">
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => handleDelete(payment.ID)}
              >
                <Trash width={16} height={16} />
              </button>
            </div>
          )}
        </div>
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
    </div>
  );
}

export default memo(PaymentCard);
