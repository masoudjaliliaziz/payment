import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentItem } from "../api/deleteData";
import toast from "react-hot-toast";

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentItem,
    onSuccess: () => {
      toast.success("پرداخت با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => toast.error("خطا در حذف"),
  });
}
