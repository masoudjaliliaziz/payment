import { toast } from "react-toastify";
import type { DebtType } from "../types/apiTypes";
import { getDigest } from "./getDigest";

export async function handleAddItem(
  data: {
    price: string;
    dueDate: string;
    serial: string;
    seri: string;
    parentGUID: string;
    dayOfYear: string;
  }
  //   setState: (state: any) => void,
  //   onReload: () => void
) {
  const listName = "CustomerPayment";
  const itemType = "SP.Data.CustomerPaymentListItem";
  const webUrl = "https://crm.zarsim.com";

  if (!data.price && !data.dueDate && !data.serial && !data.seri) {
    // setState({ message: "لطفاً یک عنوان وارد کنید." });
    alert("لطفاً همه عنوانین را وارد کنید.");
    return;
  }

  try {
    const digest = await getDigest();

    await fetch(`${webUrl}/_api/web/lists/getbytitle('${listName}')/items`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify({
        __metadata: { type: itemType },
        Title: "disributer check",
        price: data.price,
        dueDate: data.dueDate,
        serial: data.serial,
        seri: data.seri,
        dayOfYear: data.dayOfYear,
        status: "0",
        parentGUID: data.parentGUID,
      }),
    });

    // setState({ message: `آیتم جدید (${title}) به لیست چک‌ها اضافه شد.`, title: "" });
    // onReload();
  } catch (err) {
    if (err instanceof Error) {
      console.error("خطا:", err.message);
    } else {
      console.error("خطای ناشناس:", err);
    }
  }
}

export async function handleAddTestItem(data: DebtType) {
  const listName = "Debt";
  const itemType = "SP.Data.DebtListItem";
  const webUrl = "https://crm.zarsim.com";

  if (
    !data.orderNum &&
    !data.parentGUID &&
    !data.userName &&
    !data.debt &&
    !data.debtDate
  ) {
    // setState({ message: "لطفاً یک عنوان وارد کنید." });
    toast.info("لطفاً همه عنوانین را وارد کنید.");
    return;
  }

  try {
    const digest = await getDigest();

    await fetch(`${webUrl}/_api/web/lists/getbytitle('${listName}')/items`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify({
        __metadata: { type: itemType },
        Title: "Debt check",
        orderNum: String(data.orderNum),
        debt: String(data.debt),
        debtDate: String(data.debtDate),
        userName: String(data.userName),
        parentGUID: data.parentGUID,
      }),
    });

    // setState({ message: `آیتم جدید (${title}) به لیست چک‌ها اضافه شد.`, title: "" });
    // onReload();
  } catch (err) {
    if (err instanceof Error) {
      console.error("خطا:", err.message);
    } else {
      console.error("خطای ناشناس:", err);
    }
  }
}
