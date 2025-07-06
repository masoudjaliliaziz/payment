import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentItem } from "../api/updateData";
import toast from "react-hot-toast";
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: Partial<{ price: string; dueDate: string }>;
    }) => updatePaymentItem(itemId, data),
    onSuccess: () => {
      toast.success("پرداخت با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => toast.error("خطا در ویرایش"),
  });
}
