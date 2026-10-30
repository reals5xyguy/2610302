// CSV(CP949)를 읽어 api/_lib/daycares.json 을 만든다. 데이터가 바뀔 때 1회 실행.
//   node scripts/build-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { GUS, TYPES } from '../api/_lib/constants.js';

const SRC = new URL('../data/경상남도 창원시_어린이집 현황_20260903.csv', import.meta.url);
const OUT = new URL('../api/_lib/daycares.json', import.meta.url);
const GU_RE = new RegExp(`(${GUS.map((g) => g.slice(0, -1)).join('|')})구`);

// 따옴표 안의 쉼표를 처리하는 CSV 파서
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

const text = new TextDecoder('euc-kr').decode(readFileSync(SRC));
const [header, ...body] = parseCSV(text);
const col = (name) => {
  const i = header.indexOf(name);
  if (i < 0) throw new Error(`열 없음: ${name}`);
  return i;
};
const C = {
  name: col('어린이집명'), dong: col('행정동명'), type: col('어린이집유형구분'),
  capacity: col('정원수'), staff: col('보육교직원수'), address: col('소재지도로명주소'),
  basis: col('데이터기준일자'),
};

const items = body.map((r) => {
  const gu = r[C.address].match(GU_RE)?.[0];
  if (!gu) throw new Error(`구 추출 실패: ${r[C.name]} / ${r[C.address]}`);
  if (!TYPES.includes(r[C.type])) throw new Error(`모르는 유형: ${r[C.type]}`);
  return {
    name: r[C.name], dong: r[C.dong], type: r[C.type],
    capacity: Number(r[C.capacity]), staff: Number(r[C.staff]),
    address: r[C.address], gu,
  };
});
if (items.length !== 491) throw new Error(`행 수가 491이 아님: ${items.length}`);

const basisDates = [...new Set(body.map((r) => r[C.basis]))];
if (basisDates.length !== 1) throw new Error(`기준일이 여러 개: ${basisDates}`);

items.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
writeFileSync(OUT, JSON.stringify({ basisDate: basisDates[0], items }));

const count = (key) => Object.fromEntries([...new Set(items.map((x) => x[key]))].map((v) => [v, items.filter((x) => x[key] === v).length]));
console.log(`${items.length}행 → api/_lib/daycares.json (기준일 ${basisDates[0]})`);
console.log('구별', count('gu'));
console.log('유형별', count('type'));
