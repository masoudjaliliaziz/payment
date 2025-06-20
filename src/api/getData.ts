export type PaymentType = {
  price: string;
  dueDate: string;
  serial: string;
  seri: string;
  parentGUID: string;
  Title: string;
  status: string;
  agentDescription: string;
  agentUnconfirmReason: string;
  treasuryConfirmDescription: string;
  treasuryUnconfirmReason: string;
};

export async function loadPayment(
  parentGUID: string
): Promise<Partial<PaymentType[]>> {
  const webUrl = "https://crm.zarsim.com";
  const listName = "CustomerPayment";

  try {
    const response = await fetch(
      `${webUrl}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${parentGUID}'`,
      {
        headers: { Accept: "application/json;odata=verbose" },
      }
    );

    const data = await response.json();

    return data.d.results;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}

export async function loadDebt(
  parentGUID: string
): Promise<Partial<PaymentType[]>> {
  const webUrl = "https://crm.zarsim.com";
  const listName = "Debt";

  try {
    const response = await fetch(
      `${webUrl}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${parentGUID}'`,
      {
        headers: { Accept: "application/json;odata=verbose" },
      }
    );

    const data = await response.json();
    console.log(data.d.results);
    return data.d.results;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}
