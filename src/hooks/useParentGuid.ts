import { useEffect, useState } from "react";

export const useParentGuid = (): string => {
  const [guid, setGuid] = useState("");

  useEffect(() => {
    // مرحله 1: گرفتن از search (قبل از #)
    const searchParams = new URLSearchParams(window.location.search);
    const guidFromSearch = searchParams.get("guid_form");

    if (guidFromSearch) {
      localStorage.setItem("guid_form", guidFromSearch);
      setGuid(guidFromSearch);
      return;
    }

    // مرحله 2: بررسی hash (برای زمانی که ?guid داخل #/ هست)
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(
      hash.includes("?") ? hash.split("?")[1] : ""
    );
    const guidFromHash = hashParams.get("guid_form");

    if (guidFromHash) {
      localStorage.setItem("guid_form", guidFromHash);
      setGuid(guidFromHash);
      return;
    }

    // مرحله 3: گرفتن از localStorage
    const fromStorage = localStorage.getItem("guid_form") ?? "";
    setGuid(fromStorage);
  }, []);

  return guid;
};
