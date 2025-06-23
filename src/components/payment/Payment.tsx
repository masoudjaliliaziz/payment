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
  const totalPendingAgent = useSelector(
    (state: RootState) => state.someFeature.totalPendingAgent
  );

  const totalPendingTreatury = useSelector(
    (state: RootState) => state.someFeature.totalPendingTretury
  );
  return (
    <div className="bg-base-100 p-4 flex flex-col items-center justify-start min-h-screen gap-3 transition-colors duration-500 w-full relative">
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

      <div className="bg-base-100 sticky bottom-3 w-1/2 mx-auto flex flex-row-reverse gap-3 justify-around items-center p-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm  ">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-success"> جمع پرداخت های تایدد شده </span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalFinal.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-info">جمع پرداخت های درانتظار تایید خزانه</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingTreatury.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-warning">
            جمع پرداخت های درانتظار تایید کارشناس
          </span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">
              {totalPendingAgent.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
