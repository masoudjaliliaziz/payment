// API برای بررسی مجوزهای کاربر روی آیتم‌های خاص
export async function checkItemPermissions(itemId: number) {
  const BASE_URL = "https://crm.zarsim.com";

  try {
    const response = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('CustomerPayment')/items(${itemId})/effectivebasepermissions`,
      {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      itemId,
      permissions: data.d.EffectiveBasePermissions,
      hasRead: data.d.EffectiveBasePermissions.High & 1, // SPBasePermissions.ViewListItems
      hasEdit: data.d.EffectiveBasePermissions.High & 2, // SPBasePermissions.EditListItems
      hasDelete: data.d.EffectiveBasePermissions.High & 4, // SPBasePermissions.DeleteListItems
    };
  } catch (error) {
    console.error("خطا در بررسی مجوزهای آیتم:", error);
    return null;
  }
}

// API برای بررسی مجوزهای کاربر روی لیست
export async function checkListPermissions() {
  const BASE_URL = "https://crm.zarsim.com";

  try {
    const response = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('CustomerPayment')/effectivebasepermissions`,
      {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      permissions: data.d.EffectiveBasePermissions,
      hasRead: data.d.EffectiveBasePermissions.High & 1,
      hasEdit: data.d.EffectiveBasePermissions.High & 2,
      hasDelete: data.d.EffectiveBasePermissions.High & 4,
    };
  } catch (error) {
    console.error("خطا در بررسی مجوزهای لیست:", error);
    return null;
  }
}

// API برای دریافت اطلاعات کامل آیتم (شامل فیلدهای مخفی)
export async function getItemWithAllFields(itemId: number) {
  const BASE_URL = "https://crm.zarsim.com";

  try {
    const response = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('CustomerPayment')/items(${itemId})?$select=*`,
      {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.d;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کامل آیتم:", error);
    return null;
  }
}
