import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loadDebt } from "../../api/getData";
import { useEffect } from "react";
import { setDebt } from "../../someSlice";
import type { RootState } from "../../store";
import type { DebtType } from "../../types/apiTypes";

const fakeData: DebtType[] = [
  {
    debt: "123456",
    debtDate: "۰۱/۰۲/۰۳",
    orderNum: "123456",
    parentGUID: "tttt",
    userName: "masoud",
  },
  {
    debt: "123456",
    debtDate: "۰۱/۰۲/۰۳",
    orderNum: "123456",
    parentGUID: "tttt",
    userName: "masoud",
  },
];

type Props = {
  parentGUID: string;
};
function Debt({ parentGUID }: Props) {
  const dispatch = useDispatch();
  const {
    data: debtList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Debt", parentGUID],
    queryFn: () => loadDebt(parentGUID),
    enabled: !!parentGUID,
  });
  useEffect(() => {
    if (debtList && debtList.length > 0) {
      dispatch(setDebt(debtList));
    }
  }, [debtList, dispatch]);

  const totalDebt = useSelector(
    (state: RootState) => state.someFeature.totalDebt
  );
  const DebtList = useSelector((state: RootState) => state.someFeature.Debt);
  return (
    <div className="flex-col justify-center items-center gap-3 w-full py-6 h-dvh relative  ">
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}
      {isError && <p className="text-red-600">خطا: {String(error)}</p>}

      <div className="flex flex-row gap-4 justify-start items-start w-full h-full ">
        {DebtList.length === 0 &&
          fakeData.map((Debt, index) => (
            <div
              key={index}
              className="flex w-1/2 items-start justify-between px-6 py-3 rounded-md border-primary border "
            >
              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  جمع کل فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.debt}
                </span>
              </div>

              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  شماره فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.orderNum}
                </span>
              </div>

              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  تاریخ ایجاد فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.debtDate}
                </span>
              </div>
            </div>
          ))}

        {DebtList !== undefined &&
          DebtList.length > 0 &&
          DebtList.map((Debt, index) => (
            <div
              key={index}
              className="flex w-1/2 items-start justify-between px-6 py-3 rounded-md border-primary border "
            >
              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  جمع کل فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.debt}
                </span>
              </div>

              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  شماره فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.orderNum}
                </span>
              </div>

              <div className="flex flex-row-reverse items-center gap-5">
                <span className="font-semibold text-sm text-primary">
                  تاریخ ایجاد فاکتور
                </span>
                <span className="font-semibold text-sm text-base-content">
                  {Debt.debtDate}
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="bg-base-100 sticky bottom-3 w-1/2 mx-auto flex flex-row-reverse gap-3 justify-center items-center p-3.5 font-bold rounded-t-xl border-primary border border-b-0 text-sm  ">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-primary"> جمع کل بدهی</span>
          <div className="flex justify-center items-center gap-3">
            <span className="text-base-content text-xs">ریال</span>
            <span className="text-info">{totalDebt.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debt;
