# Active environment file
ENV_FILE ?= .env.dev

# Load the selected environment variables
include $(ENV_FILE)
export

base_compose := docker-compose.yaml
service_file := $(wildcard docker/services/*.yaml)
compose_arg := -f $(base_compose) $(foreach f,$(service_file),-f $(f))

.PHONY: build build-no-cache start stop logs restart

build:
	docker build -t $(DOCKER_IMAGE_NAME_APP):$(DOCKER_IMAGE_TAG_APP) .

build-no-cache:
	docker build --no-cache -t $(DOCKER_IMAGE_NAME_APP):$(DOCKER_IMAGE_TAG_APP) .

start:
	docker compose --env-file $(ENV_FILE) $(compose_arg) up --build --force-recreate --detach --remove-orphans

stop: 
	docker compose --env-file $(ENV_FILE) down

logs:
	docker compose --env-file $(ENV_FILE) logs -f

restart: stop start


