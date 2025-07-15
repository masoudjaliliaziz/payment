export async function getSayadToken() {
  const res = await fetch("http://localhost:3001/api/get-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
