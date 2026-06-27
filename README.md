# woody-book

[woody-book]책을 읽고, 별점을 남기고, 나만의 서재를 완성하는 도서 리뷰 플랫폼

## 배포

- 프론트엔드: https://woody-book-orcin.vercel.app
- 백엔드 API: https://woody-book-api.onrender.com (`/docs`에서 API 문서 확인)

## 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | React + Vite + TypeScript + Tailwind CSS, React Router, TanStack Query, Axios |
| 백엔드 | Python + FastAPI + SQLAlchemy(async) + asyncpg |
| DB | PostgreSQL (Docker 또는 Supabase 등 원격 인스턴스) |
| 인증 | JWT(access/refresh, bcrypt) + 구글 OAuth |

## 구현 범위

- 회원가입/로그인, 구글 OAuth 로그인
- 책 목록(페이지네이션·카테고리/장르 필터·정렬) / 상세(평균 별점·위시 카운트·위시 여부)
- 리뷰 작성/조회/삭제
- 댓글 작성/조회/삭제
- 위시리스트 추가/삭제/조회 (`/books/{id}/wish`, `/wishes`)

다음 단계: 검색, 추천, 마이페이지

## 빠르게 시작하기

백엔드와 프론트엔드를 한 번에 실행하려면 (각각 최초 1회 설정을 마친 뒤):

```bash
make dev
```

`server/.venv`와 `client/node_modules`가 준비되어 있어야 하며, `Ctrl+C`로 둘 다 종료됩니다.
DB는 별도 프로세스이므로 로컬 Docker DB를 쓰는 경우 `docker compose up -d`를 먼저 실행해야 합니다(아래 "1. DB" 참고). 원격 DB(Supabase 등)를 쓰는 경우 `server/.env`의 `DATABASE_URL`만 맞으면 이 단계는 건너뛰어도 됩니다.

## 처음부터 설정하기

### 1. DB

로컬 Docker DB를 쓰는 경우:

```bash
docker compose up -d
```

PostgreSQL 16-alpine 컨테이너가 실행됩니다. Supabase 등 원격 DB를 쓰는 경우, `server/.env`의 `DATABASE_URL`에 해당 연결 문자열을 넣으면 이 단계는 필요 없습니다.

### 2. 백엔드

```bash
cd server
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
python -m app.seed   # 샘플 책 데이터 + 테스트 계정(test_account1 / test_account1) 추가
uvicorn app.main:app --reload
```

추가 시드 스크립트(선택):

```bash
python -m app.seed_naver      # 네이버 도서 데이터 시드
python -m app.seed_community  # 커뮤니티/리뷰 샘플 데이터 시드
```

테스트 및 린트:

```bash
pytest
ruff check app
```

API 문서: http://localhost:8000/docs

### 3. 프론트엔드

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

http://localhost:5173 에서 확인합니다.

빌드 및 린트:

```bash
npm run build
npm run lint
```

## 주요 API

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/auth/register` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| POST | `/auth/refresh` | 토큰 재발급 |
| GET | `/auth/me` | 내 정보 조회 |
| GET | `/auth/google/login` | 구글 로그인 리다이렉트 |
| GET | `/auth/google/callback` | 구글 로그인 콜백 |
| GET | `/books` | 책 목록 조회 |
| GET | `/books/{book_id}` | 책 상세 조회 |
| GET/POST | `/books/{book_id}/reviews` | 리뷰 조회/작성 |
| DELETE | `/books/{book_id}/reviews/{review_id}` | 리뷰 삭제 |
| GET/POST | `/books/{book_id}/comments` | 댓글 조회/작성 |
| DELETE | `/books/{book_id}/comments/{comment_id}` | 댓글 삭제 |
| GET | `/books/{book_id}/wish` | 위시 여부 조회 |
| POST | `/books/{book_id}/wish` | 위시리스트에 추가 |
| DELETE | `/books/{book_id}/wish` | 위시리스트에서 제거 |
| GET | `/wishes` | 내 위시리스트 조회(페이지네이션) |

전체 명세는 `/docs`(Swagger UI)를 참고하세요.
