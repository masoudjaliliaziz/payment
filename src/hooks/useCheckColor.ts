import { useState, useEffect } from "react";
import { getCheckColors, getSayadToken } from "../api/getToken";
import type { CheckColor } from "../types/apiTypes";

export function useCheckColor(nationalId?: string) {
  const [colorData, setColorData] = useState<CheckColor>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!nationalId) return;

    const fetchCheckColor = async () => {
      const trackId = Math.floor(Math.random() * 1_000_000_000).toString();
      setLoading(true);
      setError(null);

      try {
        const token = await getSayadToken("credit:cheque-color-inquiry:get");
        const getColor = await getCheckColors(nationalId, token, trackId);
        setColorData(getColor);
        console.log("✅ TrackID:", trackId, "NationalID:", nationalId);
      } catch (err) {
        console.error("❌ خطا در دریافت رنگ چک:", err);
        setError("خطا در دریافت اطلاعات رنگ");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckColor();
  }, [nationalId]);

  return { colorData, loading, error };
}
