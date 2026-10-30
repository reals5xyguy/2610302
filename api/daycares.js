// GET /api/daycares?gu=&type=  →  { basisDate, count, items }
// 첫 버전은 CSV에서 만든 JSON(api/_lib/daycares.json)을 읽는다. Supabase 연결은 docs/todo.md 참고.
import data from './_lib/daycares.json' with { type: 'json' };
import { GUS, TYPES } from './_lib/constants.js';

export default function handler(req, res) {
  const params = new URL(req.url, 'http://localhost').searchParams;
  const gu = params.get('gu') || '';
  const type = params.get('type') || '';

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if ((gu && !GUS.includes(gu)) || (type && !TYPES.includes(type))) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: '허용되지 않는 구 또는 유형입니다' }));
    return;
  }

  const items = data.items
    .filter((x) => (!gu || x.gu === gu) && (!type || x.type === type))
    .map(({ name, address, capacity, staff, type, gu }) => ({ name, address, capacity, staff, type, gu }));

  res.statusCode = 200;
  res.end(JSON.stringify({ basisDate: data.basisDate, count: items.length, items }));
}
