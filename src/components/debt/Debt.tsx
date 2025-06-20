import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loadDebt } from "../../api/getData";
import { useEffect } from "react";
import { setDebt } from "../../someSlice";
import type { RootState } from "../../store";

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
  return (
    <div>
      {isLoading && (
        <span className="loading loading-infinity loading-lg"></span>
      )}
      {isError && <p className="text-red-600">خطا: {String(error)}</p>}
      <p className="bg-red-300">{totalDebt}</p>
      {parentGUID}
    </div>
  );
}

export default Debt;
