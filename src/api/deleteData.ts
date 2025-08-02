import { getDigest } from "./getDigest";

export async function 
deletePaymentItem(itemId: number) {
  const digest = await getDigest();
  const res = await fetch(
    `https://crm.zarsim.com/_api/web/lists/getbytitle('CustomerPayment')/items(${itemId})`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
        "X-HTTP-Method": "DELETE",
        "IF-MATCH": "*",
      },
    }
  );

  if (!res.ok) throw new Error("حذف با خطا مواجه شد");
}

export async function deletePaymentDraftItem(itemId: number) {
  const digest = await getDigest();
  const res = await fetch(
    `https://crm.zarsim.com/_api/web/lists/getbytitle('CustomerPaymentDraft')/items(${itemId})`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
        "X-HTTP-Method": "DELETE",
        "IF-MATCH": "*",
      },
    }
  );

  if (!res.ok) throw new Error("حذف با خطا مواجه شد");
}