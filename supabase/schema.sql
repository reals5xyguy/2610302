-- 창원시 어린이집 현황 테이블
-- 원본: data/경상남도 창원시_어린이집 현황_20260903.csv

create table public.daycares (
  id          bigint generated always as identity primary key,
  name        text not null,
  dong        text not null,
  type        text not null,
  capacity    integer not null,
  staff       integer not null,
  address     text not null,
  gu          text not null,
  basis_date  date not null,
  unique (name, address)
);

create index daycares_gu_idx   on public.daycares (gu);
create index daycares_type_idx on public.daycares (type);

alter table public.daycares enable row level security;

-- 누구나 읽기만 가능. insert/update/delete 정책이 없으므로 anon 키로는 쓰기 불가
create policy "daycares are readable by everyone"
  on public.daycares for select
  to anon, authenticated
  using (true);
