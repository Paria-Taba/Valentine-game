const API_URL = process.env.NEXT_PUBLIC_COUPLES_API!;

export async function apiPost(action: string, data: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
}

export async function apiGet(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${query}`);
  return res.json();
}
