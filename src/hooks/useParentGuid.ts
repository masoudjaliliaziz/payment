import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useParentGuid = (): string => {
  const [params] = useSearchParams();

  const guid = useMemo(() => {
    // اول تلاش کن از React Router بگیری
    const fromRouter = params.get("guid_form");
    if (fromRouter) return fromRouter;

    // اگر React Router نتونست، مستقیم از URL کامل بگیر
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get("guid_form");
    if (fromUrl) return fromUrl;

    // در نهایت از localStorage بخون
    const fromStorage = localStorage.getItem("guid_form") ?? "";
    return fromStorage;
  }, [params]);

  return guid ?? "";
};
