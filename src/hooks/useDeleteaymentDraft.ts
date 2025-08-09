import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentDraftItem } from "../api/deleteData";
import { toast } from "react-toastify";

export function useDeletePaymentDraft(parentGUID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentDraftItem,
    onSuccess: () => {
      toast.success("پیش نویس پرداخت با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["paymentsDraft", parentGUID] });
    },
    onError: () => toast.error("خطا در حذف"),
  });
}
