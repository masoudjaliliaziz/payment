// فایل ../../utils/handleQrCode.ts
export const handleQRCodeInput = (
  value: string,
  setSayadiCode: (value: string) => void,
  setNationalId: (value: string) => void,
  activeTab: "haghighi" | "hoghoghi"
) => {
  setSayadiCode(getLast16Chars(value));
  const national = getOwnerNationalId(value, activeTab);
  if (
    (activeTab === "haghighi" && national.length === 10) ||
    (activeTab === "hoghoghi" && national.length === 11)
  ) {
    setNationalId(national);
  }
};

function getLast16Chars(str: string) {
  return str.slice(-16);
}

function getOwnerNationalId(str: string, activeTab: "haghighi" | "hoghoghi") {
  if (!str.includes("IR")) return "";
  const parts = str.split("IR");
  if (parts.length < 2) return "";

  const lengthRequired = activeTab === "haghighi" ? 10 : 11;
  if (parts[0].length < lengthRequired) return "";

  return parts[0].slice(-lengthRequired);
}
