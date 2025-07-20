import { useEffect, useState } from "react";
import UploadCheckout from "./components/checks/uploadCheckout";
import TestAdd from "./components/TestAdd";
import Payment from "./components/payment/Payment";
import Debt from "./components/debt/Debt";
import { useParentGuid } from "./hooks/useParentGuid";
// import { useCustomers } from "./hooks/useCustomerData";
// import type { CustomerType } from "./types/apiTypes";
// import { loadCurrentUser } from "./api/getData";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [customerData, setCustomerData] = useState<CustomerType[] | undefined>(
  //   undefined
  // );

  // Step 1: دریافت guid و مشتری‌ها
  const guid = useParentGuid();
  // const { data: rawCustomerData, isLoading, error } = useCustomers(guid); // اگر از react-query استفاده می‌کنی

  // Step 2: آماده بودن داده‌ها رو بررسی کن
  // const isReady = Boolean(
  //   guid && rawCustomerData && rawCustomerData.length > 0
  // );

  // Step 3: ست کردن داده فقط زمانی که آماده است
  // useEffect(() => {
  //   if (isReady) {
  //     const filtered = (rawCustomerData ?? []).filter(
  //       (item): item is CustomerType => item !== undefined
  //     );
  //     setCustomerData(filtered);
  //   }
  // }, [isReady, rawCustomerData]);


  // Step 4: تم دارک/لایت
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Step 5: لودینگ یا ارور هندلینگ
  // if (!guid || isLoading) {
  //   return (
  //     <div className="p-4 text-center text-base-content">
  //       در حال دریافت اطلاعات...
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="p-4 text-center text-red-500">
  //       خطا در دریافت اطلاعات مشتری‌ها
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-base-100">
      {/* نوار بالا */}
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl text-base-content">زرسیم</a>
        </div>
        <div className="navbar-end">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="btn btn-outline btn-sm border-base-content text-base-content"
          >
            {isDarkMode ? "🌞 لایت" : "🌙 دارک"}
          </button>
        </div>
      </div>

      {/* گرید اصلی */}
      <div className="grid grid-cols-5 gap-4 p-4 w-full mx-auto">
        <div className="col-span-1">
          <UploadCheckout  parent_GUID={guid} />
        </div>
        <div className="col-span-2 bg-base-200 rounded-lg shadow-md">
          <Payment parentGUID={guid} />
        </div>
        <div className="col-span-2 bg-base-200 rounded-lg shadow-md">
          <Debt parentGUID={guid} />
        </div>
      </div>

      {/* نمایش اطلاعات مشتری در صورت نیاز */}
      <div className="p-4"></div>

      <div className="mt-4">
        <TestAdd parentGUID={guid} />
      </div>
    </div>
  );
}

export default App;
