import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { HashRouter } from "react-router-dom";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <App />
          <ToastContainer
            toastClassName="custom-toast"
            position="top-center"
            autoClose={5000} // میلی‌ثانیه تا نوتیف حذف بشه
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={true} // اگر میخوای راست‌چین باشه
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
