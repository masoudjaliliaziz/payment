// API برای دریافت اطلاعات کاربر فعلی از SharePoint
export async function getCurrentUser() {
  const BASE_URL = "https://crm.zarsim.com";

  try {
    const response = await fetch(`${BASE_URL}/_api/web/currentuser`, {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
      credentials: "include", // برای Windows Authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.d.Id,
      title: data.d.Title,
      loginName: data.d.LoginName,
      email: data.d.Email,
      isSiteAdmin: data.d.IsSiteAdmin,
      principalType: data.d.PrincipalType,
    };
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر فعلی:", error);
    return null;
  }
}

// API برای دریافت اطلاعات context کاربر
export async function getCurrentUserContext() {
  const BASE_URL = "https://crm.zarsim.com";

  try {
    const response = await fetch(`${BASE_URL}/_api/contextinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      formDigestValue: data.d.GetContextWebInformation.FormDigestValue,
      webFullUrl: data.d.GetContextWebInformation.WebFullUrl,
      siteFullUrl: data.d.GetContextWebInformation.SiteFullUrl,
      user: data.d.GetContextWebInformation.User,
    };
  } catch (error) {
    console.error("خطا در دریافت context کاربر:", error);
    return null;
  }
}

