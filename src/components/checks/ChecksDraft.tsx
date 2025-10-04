import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  loadPayment,
  loadPaymentDraft,
  loadDebt,
  type PaymentType,
} from "../../api/getData";
import {
  calculateRasDatePayment,
  calculateRasDateDebt,
} from "../../utils/calculateRasDate";
import { getShamsiDateFromDayOfYear } from "../../utils/getShamsiDateFromDayOfYear";
import ChecksDraftDiv from "./ChecksDraftDiv";
import { handleAddItemToPayment } from "../../api/addData";
import { toast } from "react-toastify";
import type { DebtType } from "../../types/apiTypes";

// توابع کمکی
const convertPersianDigitsToEnglish = (str: string): string => {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
};

const getTodayShamsiDayOfYear = (): number => {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    month: "numeric",
    day: "numeric",
  });

  const [monthStr, dayStr] = formatter
    .format(new Date())
    .split("/")
    .map((part) => convertPersianDigitsToEnglish(part.trim()));

  const month = Number(monthStr);
  const day = Number(dayStr);

  const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonths[i];
  }
  return dayOfYear;
};

const isValidNumber = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null || value === "") return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};
type Props = {
  parentGUID: string;
  typeactiveTab: "1" | "2";
  customerCode?: string;
  customerTitle?: string;
};

function ChecksDraft({
  parentGUID,
  typeactiveTab,
  customerCode,
  customerTitle,
}: Props) {
  // دریافت لیست پیش‌نویس‌ها
  const { data: paymentListDraft = [], isLoading: isLoadingDraft } = useQuery<
    PaymentType[]
  >({
    queryKey: ["paymentsDraft", parentGUID],
    queryFn: async () => {
      const data = await loadPaymentDraft(parentGUID);
      return (data as (PaymentType | undefined)[])
        .filter((item): item is PaymentType => item !== undefined)
        .filter((item) => item.status === "0");
    },
    enabled: !!parentGUID,
    refetchInterval: 3000,
  });

  // دریافت لیست کامل پرداخت‌ها
  const { data: paymentList = [], isLoading: isLoadingPayments } = useQuery<
    PaymentType[]
  >({
    queryKey: ["payments", parentGUID],
    queryFn: async () => {
      const data = await loadPayment(parentGUID);
      return (data as (PaymentType | undefined)[]).filter(
        (item): item is PaymentType => item !== undefined
      );
    },
    enabled: !!parentGUID,
  });

  // دریافت لیست بدهی‌ها
  const { data: debtList = [], isLoading: isLoadingDebts } = useQuery<
    DebtType[]
  >({
    queryKey: ["Debt", parentGUID],
    queryFn: async () => {
      const data = await loadDebt(parentGUID);
      return (data as (DebtType | undefined)[]).filter(
        (item): item is DebtType => item !== undefined
      );
    },
    enabled: !!parentGUID,
    refetchInterval: 30000,
  });

  const [selectedPayments, setSelectedPayments] = useState<PaymentType[]>([]);

  const toggleSelect = (payment: PaymentType) => {
    setSelectedPayments((prev) => {
      const exists = prev.some((p) => p.ID === payment.ID);
      if (exists) return prev.filter((p) => p.ID !== payment.ID);
      return [...prev, payment];
    });
  };

  const toggleSelectAll = () => {
    if (selectedPayments.length === paymentListDraft.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(paymentListDraft);
    }
  };

  // محاسبه راس بدهی‌ها
  const dueDateDisplayCalculated = useMemo(() => {
    // فیلتر بدهی‌هایی که مقادیر معتبر دارن
    const validDebts = debtList.filter(
      (d) => isValidNumber(d.debt) && isValidNumber(d.dayOfYear)
    );
    if (validDebts.length === 0) {
      console.warn("هیچ بدهی معتبری برای محاسبه راس وجود ندارد");
      return null;
    }
    const ras = calculateRasDateDebt(validDebts);
    if (!isValidNumber(ras)) {
      console.warn("محاسبه راس بدهی‌ها ناموفق بود:", ras);
      return null;
    }
    return ras;
  }, [debtList]);

  // فیلتر پرداخت‌های انتخاب‌شده برای اطمینان از مقادیر معتبر
  const validSelectedPayments = useMemo(() => {
    return selectedPayments.filter(
      (p) => isValidNumber(p.price) && isValidNumber(p.dayOfYear)
    );
  }, [selectedPayments]);

  // محاسبه راس چک‌های انتخاب‌شده
  const rasDayOfYear = useMemo(() => {
    if (validSelectedPayments.length === 0) return null;
    const ras = calculateRasDatePayment(validSelectedPayments);
    return isValidNumber(ras) ? ras : null;
  }, [validSelectedPayments]);

  const rasDate = rasDayOfYear ? getShamsiDateFromDayOfYear(rasDayOfYear) : "—";
  const todayDayOfYear = getTodayShamsiDayOfYear();

  // محاسبه اختلاف راس چک‌ها با راس بدهی‌ها
  const dayDifferenceRas = useMemo(() => {
    if (
      !isValidNumber(rasDayOfYear) ||
      !isValidNumber(dueDateDisplayCalculated)
    ) {
      return null;
    }
    return Number(rasDayOfYear) - Number(dueDateDisplayCalculated);
  }, [rasDayOfYear, dueDateDisplayCalculated]);

  const differenceTextRas = useMemo(() => {
    if (dayDifferenceRas === null) return "—";
    return dayDifferenceRas === 0
      ? "0 روز"
      : dayDifferenceRas > 0
      ? `${dayDifferenceRas} روز مانده`
      : `${Math.abs(dayDifferenceRas)} روز گذشته`;
  }, [dayDifferenceRas]);

  // محاسبه اختلاف راس چک‌ها با امروز
  const dayDifferenceToday = useMemo(() => {
    if (!isValidNumber(rasDayOfYear)) return null;
    return Number(rasDayOfYear) - todayDayOfYear;
  }, [rasDayOfYear, todayDayOfYear]);

  const differenceTextToday = useMemo(() => {
    if (dayDifferenceToday === null) return "—";
    return dayDifferenceToday === 0
      ? "0 روز"
      : dayDifferenceToday > 0
      ? `${dayDifferenceToday} روز مانده`
      : `${Math.abs(dayDifferenceToday)} روز گذشته`;
  }, [dayDifferenceToday]);

  const totalSelectedPrice = validSelectedPayments.reduce((sum, p) => {
    const amount = Number(p.price);
    return sum + (isValidNumber(amount) ? amount : 0);
  }, 0);

  const queryClient = useQueryClient();

  const hasDraftPayments = paymentList.some(
    (item) => item.status !== "3" && item.status !== "4" && item.status !== "2"
  );

  const groupMutation = useMutation({
    mutationFn: async () => {
      if (hasDraftPayments) {
        toast.error(
          "چک‌های پیش‌نویس (وضعیت 0) وجود دارند. ابتدا آن‌ها را ثبت کنید."
        );
        throw new Error("Draft payments with status 0 exist");
      }

      for (const payment of selectedPayments) {
        console.log("Payment invoiceType:", payment.invoiceType);
        console.log("Using invoiceType:", payment.invoiceType || typeactiveTab);
        let data = {};
        if (payment.cash === "0") {
          if (payment.VerifiedHoghoghi) {
            data = {
              price: payment.price === "" ? "" : payment.price.toString(),
              dueDate: payment.dueDate,
              dayOfYear: String(payment.dayOfYear),
              sayadiCode: payment.sayadiCode.trim(),
              nationalIdHoghoghi: payment.nationalIdHoghoghi,
              parentGUID: payment.parentGUID,
              itemGUID: payment.itemGUID,
              SalesExpert: payment.SalesExpert || "",
              SalesExpertAcunt_text: payment.SalesExpertAcunt_text || "",
              cash: "0",
              invoiceType: payment.invoiceType || typeactiveTab,
              customerCode: customerCode || "",
              customerTitle: customerTitle || "",
            };
          } else {
            data = {
              price: payment.price === "" ? "" : payment.price.toString(),
              dueDate: payment.dueDate,
              dayOfYear: String(payment.dayOfYear),
              sayadiCode: payment.sayadiCode.trim(),
              nationalId: payment.nationalId,
              parentGUID: payment.parentGUID,
              itemGUID: payment.itemGUID,
              SalesExpert: payment.SalesExpert || "",
              SalesExpertAcunt_text: payment.SalesExpertAcunt_text || "",
              cash: "0",
              status: "0",
              invoiceType: payment.invoiceType || typeactiveTab,
              customerCode: customerCode || "",
              customerTitle: customerTitle || "",
            };
          }
        } else {
          data = {
            price: payment.price === "" ? "" : payment.price.toString(),
            dueDate: payment.dueDate,
            dayOfYear: String(payment.dayOfYear),
            parentGUID: payment.parentGUID,
            bankName: payment.bankName || "",
            cash: "1",
            itemGUID: payment.itemGUID,
            SalesExpert: payment.SalesExpert || "",
            SalesExpertAcunt_text: payment.SalesExpertAcunt_text || "",
            status: "0",
            invoiceType: payment.invoiceType || typeactiveTab,
            customerCode: customerCode || "",
            customerTitle: customerTitle || "",
          };
        }

        await handleAddItemToPayment(data);
      }
    },
    onSuccess: () => {
      toast.success("تمام چک‌های انتخاب‌شده با موفقیت ثبت شدند");
      setSelectedPayments([]);
      queryClient.invalidateQueries({
        queryKey: ["paymentsDraft", parentGUID],
      });
    },
    onError: () => {
      toast.error("خطا در ثبت گروهی چک‌ها");
    },
  });

  if (isLoadingDraft || isLoadingPayments || isLoadingDebts) {
    return <div className="text-center text-lg">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col h-dvh justify-between items-center gap-0 w-full bg-base-200 rounded-lg">
      <div className="sticky top-0 w-full z-20 p-3 bg-base-100 shadow-sm flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="bg-info text-white px-4 py-2 rounded-xl text-sm font-bold">
            راس چک‌ها: {rasDate}
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
            اختلاف با امروز: {differenceTextToday}
          </div>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
            اختلاف با راس بدهی‌ها: {differenceTextRas}
          </div>
          <div className="bg-success text-white px-4 py-2 rounded-xl text-sm font-bold">
            جمع مبلغ: {totalSelectedPrice.toLocaleString("fa-IR")} ریال
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="btn btn-outline btn-sm h-[35px]"
            onClick={toggleSelectAll}
          >
            {selectedPayments.length === paymentListDraft.length
              ? "عدم انتخاب همه"
              : "انتخاب همه"}
          </button>

          {selectedPayments.length > 0 && (
            <button
              type="button"
              className={`btn btn-success h-[35px] btn-sm ${
                groupMutation.isPending || hasDraftPayments
                  ? "btn-disabled"
                  : ""
              }`}
              onClick={() => {
                if (hasDraftPayments) {
                  toast.error(
                    "چک‌های پیش‌نویس (وضعیت 0) وجود دارند. ابتدا آن‌ها را ثبت کنید."
                  );
                  return;
                }
                groupMutation.mutate();
              }}
              disabled={groupMutation.isPending || hasDraftPayments}
            >
              {groupMutation.isPending
                ? "در حال ثبت چک‌ها..."
                : "ثبت چک‌های انتخاب‌شده"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-4 py-6">
        {paymentListDraft.length > 0 ? (
          <ChecksDraftDiv
            paymentList={paymentList}
            parentGUID={parentGUID}
            paymentListDraft={paymentListDraft}
            selectedPayments={selectedPayments}
            toggleSelect={toggleSelect}
            typeactiveTab={typeactiveTab}
          />
        ) : (
          <div className="text-center text-gray-500">
            هیچ چک پیش‌نویسی وجود ندارد.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChecksDraft;
