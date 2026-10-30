import { GUS, TYPES } from './config.js';
import { fetchDaycares } from './api.js';

const els = {
  form: document.getElementById('filters'),
  gu: document.getElementById('gu'),
  type: document.getElementById('type'),
  basis: document.getElementById('basis'),
  status: document.getElementById('status'),
  list: document.getElementById('list'),
};

function fillOptions(select, values) {
  for (const value of values) {
    select.append(new Option(value, value));
  }
}

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle('error', isError);
}

function renderCard(item) {
  const li = document.createElement('li');
  li.className = 'card';
  li.innerHTML = `
    <div class="card-head">
      <h2 class="card-name"></h2>
      <span class="card-type"></span>
    </div>
    <p class="card-address"></p>
    <p class="card-stats"></p>`;
  li.querySelector('.card-name').textContent = item.name;
  li.querySelector('.card-type').textContent = item.type;
  li.querySelector('.card-address').textContent = item.address;
  li.querySelector('.card-stats').textContent = `정원 ${item.capacity}명 · 보육교직원 ${item.staff}명`;
  return li;
}

// 필터를 빠르게 바꿀 때 늦게 도착한 이전 응답이 화면을 덮어쓰지 않도록 한다.
let requestId = 0;

async function load() {
  const id = ++requestId;
  setStatus('불러오는 중…');

  try {
    const data = await fetchDaycares({ gu: els.gu.value, type: els.type.value });
    if (id !== requestId) return;

    els.basis.textContent = `${data.basisDate} 기준`;
    els.list.replaceChildren(...data.items.map(renderCard));
    setStatus(data.count === 0 ? '조건에 맞는 어린이집이 없습니다' : `${data.count}곳`);
  } catch (err) {
    if (id !== requestId) return;
    els.list.replaceChildren();
    setStatus(`불러오지 못했습니다: ${err.message}`, true);
  }
}

fillOptions(els.gu, GUS);
fillOptions(els.type, TYPES);
els.form.addEventListener('change', load);
load();
