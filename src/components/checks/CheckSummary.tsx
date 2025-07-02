import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useMemo } from "react";

function CheckSummary() {
  const checkList = useSelector((state: RootState) => state.check.checks);

  const averageDate = useMemo(() => {
    if (checkList.length === 0) return "نامشخص";

    let totalWeightedDays = 0;
    let totalAmount = 0;

    let yearReference = 0;

    checkList.forEach((check, index) => {
      if (!check.dayOfYear || !check.price) return;

      const amount = Number(check.price || 0);
      if (amount === 0) return;

      const dayOfYear = Number(check.dayOfYear || 0);
      if (dayOfYear === 0) return;

      if (index === 0 && check.dueDate) {
        const dateParts = check.dueDate.split("/");
        if (dateParts.length === 3) {
          yearReference = Number(dateParts[0]);
        }
      }

      totalWeightedDays += dayOfYear * amount;
      totalAmount += amount;
    });

    if (totalAmount === 0 || yearReference === 0) return "نامشخص";

    const averageDayOfYear = totalWeightedDays / totalAmount;

    return `${yearReference}/${
      Math.floor((averageDayOfYear - 1) / 30) + 1
    }/${Math.round(((averageDayOfYear - 1) % 30) + 1)}`;
  }, [checkList]);

  if (checkList.length === 0) {
    return (
      <p className="text-center text-base-content">
        اطلاعاتی برای نمایش وجود ندارد
      </p>
    );
  }

  return (
    <div className="flex flex-col w-3/4 mt-8 border border-primary rounded-xl p-4">
      <h2 className="text-lg font-bold text-primary mb-4 text-center">
        راس‌گیری چک‌ها
      </h2>

      <div className="flex justify-center items-center gap-4 mb-6">
        <span className="text-primary text-lg font-semibold">تاریخ راس:</span>
        <span className="text-info text-lg font-bold">{averageDate}</span>
      </div>

      {checkList.map((check, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center py-2 border-b"
        >
          <span className="text-base-content">{check.dueDate}</span>
          <div className="flex items-center gap-4">
            <span className="text-info font-semibold">
              {Number(check.price || 0).toLocaleString()} ریال
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CheckSummary;
