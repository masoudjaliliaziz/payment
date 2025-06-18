import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import PaymentDiv from "./PaymentDiv";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPayments } from "../../someSlice";
import type { RootState } from "../../store";

type Props = {
  parentGUID: string;
};

function Payment({ parentGUID }: Props) {
  const dispatch = useDispatch();
  const {
    data: paymentList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments", parentGUID],
    queryFn: () => loadPayment(parentGUID),
    enabled: !!parentGUID,
  });
  useEffect(() => {
    if (paymentList && paymentList.length > 0) {
      dispatch(setPayments(paymentList));
    }
  }, [paymentList, dispatch]);
  const totalPaid = useSelector(
    (state: RootState) => state.someFeature.totalPaidPrice
  );
  return (
    <div className="bg-base-100 p-4 flex flex-col items-center justify-center min-h-screen gap-3 transition-colors duration-500 w-full">
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}
      {isError && <p className="text-red-600">خطا: {String(error)}</p>}

      {paymentList !== undefined && (
        <PaymentDiv
          paymentList={paymentList.filter(
            (p): p is PaymentType => p !== undefined
          )}
        />
      )}
      <p className="text-green-600 font-bold sticky bottom-3">
        جمع پرداخت‌شده‌ها: {totalPaid.toLocaleString()} تومان
      </p>
    </div>
  );
}

export default Payment;
