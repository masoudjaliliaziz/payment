import { getDigest } from "./getDigest";

export async function handleAddItem(
  data: {
    price: string;
    dueDate: string;
    serial: string;
    seri: string;
    parentGUID: string;
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
        status: "1",
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
