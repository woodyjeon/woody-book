.PHONY: dev backend frontend

# 백엔드 + 프론트엔드를 동시에 실행합니다 (Ctrl+C로 둘 다 종료).
dev:
	@trap 'kill 0' SIGINT; \
	(cd server && .venv/bin/uvicorn app.main:app --reload) & \
	(cd client && npm run dev) & \
	wait

backend:
	cd server && .venv/bin/uvicorn app.main:app --reload

frontend:
	cd client && npm run dev
