import { Routes, Route, Link } from "react-router-dom";
import PaymentsPage from "./routes/PaymentsPage";
import DebtsPage from "./routes/DebtsPage";
import {
  Archive,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  TicketCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import ChecksDraftPage from "./routes/ChecksDraftPage";
import DebtsArchivePage from "./routes/DebtsArchivePage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  return (
    <div className="min-h-screen flex bg-base-100 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 shadow-md flex flex-col justify-between ">
        <div className="p-4 space-y-2  flex flex-col items-center">
          <span className="text-lg font-bold mb-4 text-base-content w-full bg-base-300 text-center rounded-lg px-2 py-1 ">
            مدیریت مالی
          </span>
          <Link
            to="/checks"
            className="btn btn-ghost w-full flex justify-between text-xs"
          >
            <TicketCheck width={20} height={20} />
            ثبت چک
          </Link>
          <Link
            to="/"
            className="btn btn-ghost w-full flex justify-between text-xs"
          >
            <BanknoteArrowDownIcon width={20} height={20} />
            پرداخت
          </Link>
          <Link
            to="/debts"
            className="btn btn-ghost w-full text-xs flex justify-between"
          >
            <BanknoteArrowUpIcon width={20} height={20} />
            بدهی
          </Link>
          <Link
            to="/debts/archive"
            className="btn btn-ghost w-full text-xs flex justify-between"
          >
            <Archive width={20} height={20} />
            آرشیو بدهی ها
          </Link>
        </div>
        <div className="p-4">
          <button
            onClick={toggleDarkMode}
            className="btn btn-outline btn-sm w-full border-base-content text-base-content"
          >
            {isDarkMode ? "🌞 لایت" : "🌙 دارک"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-dvh overflow-y-auto ">
        <Routes>
          <Route path="/checks" element={<ChecksDraftPage />} />
          <Route path="/" element={<PaymentsPage />} />
          <Route path="/debts" element={<DebtsPage />} />
          <Route path="/debts/archive" element={<DebtsArchivePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
