//type for payments -------------------------

import type { CustomerType, DebtType } from "../types/apiTypes";

export type PaymentType = {
  ID: number;
  price: string;
  dueDate: string;
  sayadiCode: string;
  nationalId: string;
  itemGUID: string;
  parentGUID: string;
  dayOfYear: string;
  Title: string;
  status: string;
  agentDescription: string;
  treasuryConfirmDescription: string;
  iban: string;
  name: string;
  serialNo: string;
  seriesNo: string;
  branchCode: string;
  checksColor: string;
  Verified: string;
  SalesExpert: string;
  SalesExpertAcunt_text: string;
  cash: string;
  bankName: string;
  VerifiedHoghoghi: string;
  nationalIdHoghoghi: string;
};

//load paymentrs byu guyid for each customer -=------------------------------
export async function loadPayment(
  parentGUID: string
): Promise<Partial<PaymentType[]>> {
  const BASE_URL = "https://crm.zarsim.com";
  const listName = "CustomerPayment";
  let allResults: PaymentType[] = [];
  let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${parentGUID}'`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      const data = await response.json();

      // فرض می‌کنیم data.d.results دقیقاً CustomerItem[] هست
      allResults = [...allResults, ...data.d.results];

      nextUrl = data.d.__next || null;
    }

    return allResults;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}

//temp for develop ( this have been load from farvardin)----------------------
export async function loadDebt(
  parentGUID: string
): Promise<Partial<DebtType>[]> {
  const listName = "Debt";

  const BASE_URL = "https://crm.zarsim.com";

  let allResults: Partial<DebtType>[] = [];
  let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${parentGUID}'`;
  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      const data = await response.json();

      // فرض می‌کنیم data.d.results دقیقاً CustomerItem[] هست
      allResults = [...allResults, ...data.d.results];

      nextUrl = data.d.__next || null;
    }

    return allResults;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}

export async function loadPaymentDraft(
  parentGUID: string
): Promise<Partial<PaymentType[]>> {
  const BASE_URL = "https://crm.zarsim.com";
  const listName = "CustomerPaymentDraft";
  let allResults: PaymentType[] = [];
  let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${parentGUID}'`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      const data = await response.json();

      // فرض می‌کنیم data.d.results دقیقاً CustomerItem[] هست
      allResults = [...allResults, ...data.d.results];

      nextUrl = data.d.__next || null;
    }

    return allResults;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}

//load currentUser ---------------------------
export async function loadCurrentUser(
  parentGUID: string
): Promise<CustomerType[]> {
  if (!parentGUID) return [];

  const webUrl = "https://crm.zarsim.com";
  const listName = "customer_info";

  try {
    const response = await fetch(
      `${webUrl}/_api/web/lists/getbytitle('${listName}')/items?$filter=guid_form eq guid'${parentGUID}'`,
      {
        headers: { Accept: "application/json;odata=verbose" },
      }
    );

    const data = await response.json();
    return data.d.results;
  } catch (err) {
    console.error("خطا در دریافت اطلاعات مشتری:", err);
    return [];
  }
}

//get checks by GUID----------------------
export async function getItemIdByGuid(guid: string): Promise<number | null> {
  const webUrl = "https://crm.zarsim.com";
  const listName = "customerPayment";

  try {
    const res = await fetch(
      `${webUrl}/_api/web/lists/getbytitle('${listName}')/items?$filter=parentGUID eq '${guid}'`,
      { headers: { Accept: "application/json;odata=verbose" } }
    );

    const json = await res.json();
    const item = json?.d?.results?.[0];

    if (!item) return null;
    return item.Id; // یا item.ID
  } catch (err) {
    console.error("خطا در گرفتن آیتم:", err);
    return null;
  }
}
