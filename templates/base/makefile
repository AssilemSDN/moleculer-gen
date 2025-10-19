include .env.dev
export

ENV_FILE=.env.dev

.PHONY: build build-no-cache start stop logs restart

build:
	docker build -t $(DOCKER_IMAGE_NAME_APP):$(DOCKER_IMAGE_TAG_APP) .

build-no-cache:
	docker build --no-cache -t $(DOCKER_IMAGE_NAME_APP):$(DOCKER_IMAGE_TAG_APP) .

start:
	docker compose --env-file $(ENV_FILE) up --build --force-recreate --detach --remove-orphans

stop: 
	docker compose --env-file $(ENV_FILE) down

logs:
	docker compose --env-file $(ENV_FILE) logs -f

restart: stop start


