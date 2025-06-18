import { useQuery } from "@tanstack/react-query";
import { loadPayment, type PaymentType } from "../../api/getData";
import PaymentDiv from "./PaymentDiv";

type Props = {
  parentGUID: string;
};

function Payment({ parentGUID }: Props) {
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
    </div>
  );
}

export default Payment;
