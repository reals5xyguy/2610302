// 서버 함수(api/) 호출을 모아 두는 곳. 기능이 늘면 여기에 함수를 추가한다.

export async function fetchDaycares({ gu = '', type = '' } = {}) {
  const params = new URLSearchParams();
  if (gu) params.set('gu', gu);
  if (type) params.set('type', type);

  const res = await fetch(`/api/daycares?${params}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `요청 실패 (${res.status})`);
  }
  return body; // { basisDate, count, items }
}
