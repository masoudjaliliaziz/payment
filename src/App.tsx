import { useEffect, useState } from "react";
import UploadCheckout from "./components/checks/uploadCheckout";
import Payment from "./components/payment/Payment";
import Debt from "./components/debt/Debt";

import uuidv4 from "./utils/createGuid";

function App() {
  const [parent_GUID, setParent_GUID] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setParent_GUID(uuidv4());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* نوار بالا */}
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10 bg-blue-700">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl text-base-content">زرسیم</a>
        </div>
        <div className="navbar-end">
          <button
            onClick={toggleDarkMode}
            className="btn btn-outline btn-sm border-base-content text-base-content"
          >
            {isDarkMode ? "🌞 لایت" : "🌙 دارک"}
          </button>
        </div>
      </div>

      {/* گرید اصلی */}
      <div className="grid grid-cols-5 gap-4 p-4 w-full  mx-auto ">
        <div className=" col-span-1">
          <UploadCheckout parent_GUID={parent_GUID} />
        </div>
        <div className="col-span-2 bg-blue-400">
          <Payment parentGUID={parent_GUID} />
        </div>
        <div className="col-span-2">
          <Debt parentGUID={parent_GUID} />
        </div>
      </div>

      {/* اگر بخش تست هم نیاز بود اضافه کن: */}
      {/* <div className="mt-4">
        <TestAdd parentGUID={parent_GUID} />
      </div> */}
    </div>
  );
}

export default App;
