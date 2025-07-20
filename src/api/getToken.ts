export async function getSayadToken(scopes: string) {
  const res = await fetch("http://localhost:3001/api/get-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scopes,
    }),
  });

  const data = await res.json();
  const result = data.result.value;
  console.log("TOKEN:", data);
  return result;
}

export async function getSayadInquiry(
  sayadId: string,
  token: string,
  trackId: string
) {
  const res = await fetch("http://localhost:3001/api/sayad-inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      sayadId,
      trackId,
    }),
  });

  const data = await res.json();
  const result = await data.result;

  
  console.log("INQUIRY RESULT:", data);
  return result;
}

export async function getCheckColors(
  nationalId: string,
  token: string,
  trackId: string
) {
  const res = await fetch("http://localhost:3001/api/cheque-color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      nationalId,
      trackId,
    }),
  });

  const data = await res.json();
  console.log("وضعیت رنگ چک:", data);

  const result = await data.result;
  console.log("INQUIRY RESULT:", data);
  return result;
}
