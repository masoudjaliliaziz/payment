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
