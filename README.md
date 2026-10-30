# 창원시 어린이집 찾기

구와 어린이집 유형(국공립·민간·가정·직장·사회복지법인·법인·단체등)을 고르면 조건에 맞는 어린이집 목록을 보여 준다.

- 배포 주소: https://2610302.vercel.app/
- GitHub: https://github.com/reals5xyguy/2610302
- 데이터: 「경상남도 창원시_어린이집 현황」 2026-09-03 기준, 491곳 (`data/`)

## 실행
```bash
node scripts/build-data.mjs   # CSV → api/_lib/daycares.json (데이터가 바뀔 때만)
node scripts/dev.mjs          # http://localhost:3000
```
Vercel에는 저장소를 그대로 Import하면 된다. 환경변수는 필요 없다.

## 제출 문서
| 파일 | 내용 |
|---|---|
| [PRD.md](PRD.md) | PRD v2: 핵심 시나리오, 사용 데이터(출처·기간·한계), 완료 기준 |
| [docs/plan.md](docs/plan.md) | 첫 버전 계획 |
| [docs/poc.md](docs/poc.md) | 점검 기록: 완료 기준별 통과/실패, 불편한 점 3개 |
| [docs/learning.md](docs/learning.md) | 학습 노트 (내 말 요약 포함) |
| [docs/todo.md](docs/todo.md) | 다음 할 일: 4회차 전 / 4회차 / 5회차 |
