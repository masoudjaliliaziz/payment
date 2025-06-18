import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import UploadCheckout from "./components/checks/uploadCheckout";
import { useEffect, useState } from "react";
import uuidv4 from "./utils/createGuid";
import Payment from "./components/payment/Payment";

function App() {
  const [parent_GUID, setParent_GUID] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setParent_GUID(uuidv4());
  }, []);

  // وقتی isDarkMode تغییر کنه، کلاس dark رو روی html اضافه یا حذف کن

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // تابع سوییچ مود
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className="navbar bg-base-100  shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/">ثبت پرداخت</Link>
              </li>
              <li>
                <Link to="/payment">پرداخت ها</Link>
              </li>
              <li>
                <Link to="/debt">بدهی ها</Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl ">زرسیم</a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 ">
            <li>
              <Link to="/">ثبت پرداخت</Link>
            </li>
            <li>
              <Link to="/payment">پرداخت ها</Link>
            </li>
            <li>
              <Link to="/debt">بدهی ها</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="btn btn-outline btn-sm "
            aria-label="تغییر حالت تاریک / روشن"
          >
            {isDarkMode ? "🌞 لایت" : "🌙 دارک"}
          </button>
        </div>
      </div>

      <div className="mx-auto p-4 flex flex-col items-center justify-center min-h-screen bg-blue-200  gap-3 transition-colors duration-500 w-full">
        <Routes>
          <Route
            path="/"
            element={<UploadCheckout parent_GUID={parent_GUID} />}
          />
          <Route
            path="/payment"
            element={<Payment parentGUID={parent_GUID} />}
          />
          <Route
            path="/debt"
            element={<div className="text-center text-2xl ">بدهی ها</div>}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
