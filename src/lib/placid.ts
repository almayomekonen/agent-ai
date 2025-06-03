export async function generatePlacidPDF(fields: Record<string, string>) {
  const result = await fetch("https://api.placid.app/api/rest/compose", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PLACID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template: "l7ett0irroqke",
      data: fields,
    }),
  });

  const json = await result.json();
  return json.image_url;
}
