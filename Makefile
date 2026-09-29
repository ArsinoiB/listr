run:
	docker compose up

run-build:
	docker compose up --build


run-build-prod:
	docker compose -f compose.prod.yaml up --build

stop:
	docker compose down

build-be:
	docker build -t listr-backend ./listr-backend


build-fe:
	docker build -t listr-frontend ./listr-frontend

build: build-be build-fe
