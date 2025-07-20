import { getItemIdByGuid } from "./getData";
import { getDigest } from "./getDigest";

export async function updatePaymentItem(
  itemId: number,
  data: Partial<{ price: string; dueDate: string }>
) {
  const digest = await getDigest();
  const res = await fetch(
    `https://crm.zarsim.com/_api/web/lists/getbytitle('CustomerPayment')/items(${itemId})`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*",
      },
      body: JSON.stringify({
        __metadata: { type: "SP.Data.CustomerPaymentListItem" },
        ...data,
      }),
    }
  );

  if (!res.ok) throw new Error("ویرایش با خطا مواجه شد");
}

export async function updateCustomerItemByGuid(
  guid: string,
  fieldsToUpdate: {
    seriesNo?: string;
    serialNo?: string;
    name?: string;
    iban?: string;
    branchCode?: string;
    checksColor?: string;
  }
) {
  const listName = "customerPayment";
  const itemType = "SP.Data.CustomerPaymentListItem";
  const webUrl = "https://crm.zarsim.com";

  const itemId = await getItemIdByGuid(guid);
  if (!itemId) {
    console.error("آیتم با این GUID پیدا نشد.");
    return;
  }

  try {
    const digest = await getDigest();

    await fetch(
      `${webUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
          "X-HTTP-Method": "MERGE",
          "IF-MATCH": "*",
        },
        body: JSON.stringify({
          __metadata: { type: itemType },
          ...fieldsToUpdate, // 👈 فقط فیلدهایی که پاس داده‌ایم
        }),
      }
    );

    console.log("آیتم با موفقیت آپدیت شد.");
  } catch (err) {
    console.error("خطا در آپدیت:", err);
  }
}
