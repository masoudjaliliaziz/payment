// Configuration for SharePoint authentication
export const SHAREPOINT_CONFIG = {
  // اگر نیاز به استفاده از service account دارید
  useServiceAccount: false,

  // Service account credentials (فقط اگر useServiceAccount = true باشد)
  serviceAccount: {
    username: "",
    password: "",
  },

  // SharePoint site URL
  baseUrl: "https://crm.zarsim.com",

  // Authentication method
  authMethod: "windows" as "windows" | "basic" | "service",
};

// Helper function to get authentication headers
export function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json;odata=verbose",
  };

  if (
    SHAREPOINT_CONFIG.authMethod === "basic" &&
    SHAREPOINT_CONFIG.useServiceAccount
  ) {
    const credentials = btoa(
      `${SHAREPOINT_CONFIG.serviceAccount.username}:${SHAREPOINT_CONFIG.serviceAccount.password}`
    );
    headers["Authorization"] = `Basic ${credentials}`;
  }

  return headers;
}

// Helper function to get fetch options
export function getFetchOptions(
  method: "GET" | "POST" = "GET",
  body?: unknown
): RequestInit {
  const options: RequestInit = {
    method,
    headers: getAuthHeaders(),
    credentials: "include", // برای Windows Authentication
  };

  if (body) {
    options.body = JSON.stringify(body);
    (options.headers as Record<string, string>)["Content-Type"] =
      "application/json;odata=verbose";
  }

  return options;
}
