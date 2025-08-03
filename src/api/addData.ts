import toast from "react-hot-toast";
import type { DebtType } from "../types/apiTypes";
import { getDigest } from "./getDigest";
import type { PaymentType } from "./getData";

export async function handleAddItem(
  data: Partial<{
    price: string;
    dueDate: string;
    nationalId: string;
    parentGUID: string;
    dayOfYear: string;
    itemGUID: string;
    sayadiCode: string;
    SalesExpertAcunt_text: string;
    SalesExpert: string;
    status: string;
    cash: string;
    bankName?: string;
  }>
) {
  const listName = "CustomerPaymentDraft";
  const itemType = "SP.Data.CustomerPaymentDraftListItem";
  const webUrl = "https://crm.zarsim.com";

  if (!data.price || !data.dueDate) {
    toast.error("لطفاً مبلغ و تاریخ سررسید را وارد کنید.");
    return;
  }

  if (data.cash === "1") {
    if (!data.bankName) {
      toast.error("نام بانک الزامی است.");
      return;
    }
  } else {
    if (!data.sayadiCode) {
      toast.error("شناسه صیادی الزامی است.");
      return;
    }
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
        sayadiCode: data.sayadiCode,
        dayOfYear: data.dayOfYear,
        nationalId: data.nationalId,
        cash: data.cash,
        status: data.status,
        bankName: data.bankName || "",
        SalesExpert: data.SalesExpert,
        SalesExpertAcunt_text: data.SalesExpertAcunt_text,
        parentGUID: data.parentGUID,
        itemGUID: data.itemGUID,
      }),
    });

    toast.success("اطلاعات با موفقیت ذخیره شد.");
  } catch (err) {
    if (err instanceof Error) {
      toast.error(`خطا: ${err.message}`);
      console.error("خطا:", err.message);
    } else {
      toast.error("خطای ناشناس رخ داد");
      console.error("خطای ناشناس:", err);
    }
  }
}

export async function handleAddItemToPayment(
  data: Partial<{
    price: string;
    dueDate: string;
    nationalId: string;
    parentGUID: string;
    dayOfYear: string;
    itemGUID: string;
    sayadiCode: string;
    SalesExpertAcunt_text: string;
    SalesExpert: string;
    status: string;
    cash: string;
    bankName?: string;
  }>
) {
  const listName = "CustomerPayment";
  const itemType = "SP.Data.CustomerPaymentListItem";
  const webUrl = "https://crm.zarsim.com";

  if (!data.price || !data.dueDate) {
    toast.error("لطفاً مبلغ و تاریخ سررسید را وارد کنید.");
    return;
  }

  if (data.cash === "1") {
    if (!data.bankName) {
      toast.error("نام بانک الزامی است.");
      return;
    }
  } else {
    if (!data.sayadiCode) {
      toast.error("شناسه صیادی الزامی است.");
      return;
    }
  }

  try {
    const digest = await getDigest();

    const bodyData: Partial<
      PaymentType & { __metadata: { type: string }; Title: string }
    > = {
      __metadata: { type: itemType },
      Title: "disributer check",
      price: data.price,
      dueDate: data.dueDate,
      sayadiCode: data.sayadiCode,
      dayOfYear: data.dayOfYear,
      nationalId: data.nationalId,
      SalesExpert: data.SalesExpert,
      SalesExpertAcunt_text: data.SalesExpertAcunt_text,
      parentGUID: data.parentGUID,
      itemGUID: data.itemGUID,
      cash: data.cash,
    };

    console.log("cash value:", data.cash); // 🔍 بررسی مقدار

    if (String(data.cash) === "1") {
      bodyData.status = "1";
      bodyData.bankName = data.bankName || "";
    } else {
      bodyData.status = "0";
      bodyData.Verified = "0";
    }

    console.log("bodyData being sent:", bodyData);

    await fetch(`${webUrl}/_api/web/lists/getbytitle('${listName}')/items`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify(bodyData),
    });

    // پیدا کردن آیتم مربوط به itemGUID در customerPaymentDraft
    const res = await fetch(
      `${webUrl}/_api/web/lists/getbytitle('customerPaymentDraft')/items?$filter=itemGUID eq '${data.itemGUID}'`,
      {
        headers: {
          Accept: "application/json;odata=verbose",
        },
      }
    );

    const result = await res.json();
    const items = result.d?.results || [];

    if (items.length > 0) {
      const itemId = items[0].Id;

      await fetch(
        `${webUrl}/_api/web/lists/getbytitle('customerPaymentDraft')/items(${itemId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: JSON.stringify({
            __metadata: {
              type: "SP.Data.CustomerPaymentDraftListItem",
            },
            status: "1",
          }),
        }
      );
    }

    toast.success("اطلاعات با موفقیت ذخیره و وضعیت آپدیت شد.");
  } catch (err) {
    if (err instanceof Error) {
      toast.error(`خطا: ${err.message}`);
      console.error("خطا:", err.message);
    } else {
      toast.error("خطای ناشناس رخ داد");
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
    toast("لطفاً همه عنوانین را وارد کنید.");
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
        dayOfYear: Number(data.dayOfYear),
        status: "0",
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
