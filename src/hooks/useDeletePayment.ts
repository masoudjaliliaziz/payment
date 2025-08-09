import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentItem } from "../api/deleteData";
import { toast } from "react-toastify";

export function useDeletePayment(parentGUID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentItem,
    onSuccess: () => {
      toast.success("پرداخت با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["payments", parentGUID] });
    },
    onError: () => toast.error("خطا در حذف"),
  });
}
