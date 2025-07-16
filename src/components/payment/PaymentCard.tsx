import { useState, useEffect, memo } from "react";
import type { PaymentType } from "../../api/getData";
import { useDeletePayment } from "../../hooks/useDeletePayment";
import { useUpdatePayment } from "../../hooks/useUpdatePayment";
import ChecksPreviewItem from "./ChecksPreviewItem";
import Modal from "./Modal";
import ModalWrapper from "../ModalWrapper";
import { useQueryClient } from "@tanstack/react-query";
import { getSayadInquiry, getSayadToken } from "../../api/getToken";
import type { SayadiResultType } from "../../types/apiTypes";

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

  const [sayadiData, setSayadiData] = useState<SayadiResultType>();
  // const [colorData, setColorData] = useState<checkColor>();

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
  }, [payment]);

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
      } catch (error) {
        console.error("خطا در دریافت اطلاعات صیادی:", error);
      }
    }
    // async function getCheckColor() {
    //   // ساخت trackId رندوم هر بار
    //   const trackId = Math.floor(Math.random() * 1_000_000_000).toString();
    //   try {
    //     const token = await getSayadToken("credit:cheque-color-inquiry:get");
    //     const getColor = await getCheckColors(
    //       payment.nationalId,
    //       token,
    //       trackId
    //     );
    //     setColorData(getColor);
    //   } catch (error) {
    //     console.error("خطا در دریافت اطلاعات رنگ:", error);
    //   }
    // }
    getSayadInquery();
    // getCheckColor();
  }, []);

  // رنگ اختلاف روز بر اساس مثبت یا منفی بودن
  const getDayDiffColor = () => {
    if (payment.dayDiff == null) return "text-base-content";
    if (payment.dayDiff > 0) return "text-success";
    if (payment.dayDiff < 0) return "text-error";
    return "text-warning";
  };

  return (
    <div className="p-4 flex flex-col items-center gap-3 transition-colors duration-500 w-[33%]">
      <div className="shadow rounded-md py-5 px-4 border-primary border-2 mb-3 w-full flex flex-col justify-center items-end gap-3 bg-base-300">
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
        </div>
        <div className="flex justify-between items-center w-full flex-row-reverse">
          <ChecksPreviewItem
            title={{ slag: "نام صاحب چک", data: sayadiData?.name || "—" }}
          />

          <ChecksPreviewItem
            title={{ slag: "تاریخ سر رسید", data: payment?.dueDate || "—" }}
          />
        </div>
        <div className="flex justify-between items-center w-full flex-row-reverse">
          {" "}
          <ChecksPreviewItem
            title={{ slag: " مبلغ", data: payment?.price || "—" }}
          />
          <ChecksPreviewItem
            title={{ slag: "وضعیت", data: payment?.status || "—" }}
          />
          {/* <ChecksPreviewItem
            title={{ slag: " استعلام رنگ چک", data: colorData?.chequeColor || "—" }}
          /> */}
        </div>

        {/* نمایش اختلاف روز */}
        {payment.dayDiff !== undefined && (
          <div className={`font-bold ${getDayDiffColor()}`}>
            اختلاف با سررسید: {payment.dayDiff} روز
          </div>
        )}
        {payment.status === "0" && (
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={() => handleDelete(payment.ID)}
            >
              حذف
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              ویرایش
            </button>
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
