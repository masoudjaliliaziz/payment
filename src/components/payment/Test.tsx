import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { loadDebt, loadPayment, type PaymentType } from "../../api/getData";
// import { calculateRasDate } from "../../utils/calculateRasDate";
// import { getShamsiDateFromDayOfYear } from "../../utils/getShamsiDateFromDayOfYear";
import type { DebtType } from "../../types/apiTypes";

type Props = {
  parentGUID: string;
};

function Test({ parentGUID }: Props) {
  const { data: paymentList = [] } = useQuery<PaymentType[]>({
    queryKey: ["payments", parentGUID],
    queryFn: async () => {
      const data = await loadPayment(parentGUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 5000,
  });

  const { data: debtList = [] } = useQuery<DebtType[]>({
    queryKey: ["Debt", parentGUID],
    queryFn: async () => {
      const data = await loadDebt(parentGUID);
      return (data as (DebtType | undefined)[]).filter(
        (item): item is DebtType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 5000,
  });

  const output: DebtType[] = useMemo(() => {
    const totalPaid = paymentList.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const sortedDebts = [...debtList]
      .filter((d) => d.debt && d.dayOfYear)
      .sort((a, b) => Number(a.dayOfYear) - Number(b.dayOfYear));

    let remainingPayment = totalPaid;
    const result: DebtType[] = [];

    for (const debt of sortedDebts) {
      const currentDebt = Number(debt.debt || 0);

      if (remainingPayment >= currentDebt) {
        remainingPayment -= currentDebt;
        result.push({ ...debt, debt: "0" }); // به عنوان string
      } else if (remainingPayment > 0) {
        const newDebt = currentDebt - remainingPayment;
        result.push({ ...debt, debt: String(newDebt) });
        remainingPayment = 0;
      } else {
        result.push(debt); // هیچ تغییری نیاز نیست
      }
    }

    return result;
  }, [paymentList, debtList]);

  useEffect(() => {
    console.log("نتیجه خروجی با همه فیلدها:", output);
  }, [output]);

  return <div>Test</div>;
}

export default Test;
