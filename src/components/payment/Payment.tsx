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
  const totalFinal = useSelector(
    (state: RootState) => state.someFeature.totalFinal
  );
  const totalPending = useSelector(
    (state: RootState) => state.someFeature.totalPending
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
      <div className="sticky bottom-3 flex w-full items-center justify-center gap-5">
        <p className="text-accent font-bold ">
          جمع پرداخت شده های تایدد شده : {totalFinal.toLocaleString()} تومان
        </p>
        <p className="text-orange-500 font-bold ">
          جمع پرداخت شده های در حالت انتظار {totalPending.toLocaleString()}{" "}
          تومان
        </p>
      </div>
    </div>
  );
}

export default Payment;
