<p align="center">
  <img
    src="./docs/images/moleculer-gen.png"
    alt="moleculer-gen banner"
    width="900"
  />
</p>

<div align="center">
  <a href="https://github.com/AssilemSDN/moleculer-gen/actions/workflows/ci.yml">
    <img src="https://github.com/AssilemSDN/moleculer-gen/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" />
  </a>
  <a href="https://codecov.io/github/AssilemSDN/moleculer-gen">
    <img src="https://codecov.io/github/AssilemSDN/moleculer-gen/graph/badge.svg?token=IBG74CEDTK" alt="Codecov" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-22%20%7C%2024%20%7C%2026-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Yarn-4.18.0-2C8EBB?logo=yarn&logoColor=white" alt="Yarn" />
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
</div>

# { } moleculer gen
> A **modular platform engineering CLI** for scaffolding and extending ready-to-run [Moleculer.js](https://moleculer.services/) projects with Docker Compose, an API Gateway, databases, message transporters, and optional infrastructure modules.

Pick your **database**, message **transporter**, and optional infrastructure plugins such as **Traefik** or **Prometheus**.

`moleculer-gen` generates a complete Docker Compose development environment, so you can focus on building your microservices instead of wiring the same infrastructure from scratch.

> Designed for developers who want a fast, lightly opinionated foundation for building Moleculer.js microservices with Docker.

---

> [!WARNING]
> **moleculer-gen is under active development.**
>
> The CLI is usable today, but generated structures, configuration formats, and available modules may evolve before a stable `1.0` release.



## 🎬 Demo 
### A complete CRUD microservice stack in under one minute

Generate and start a complete CRUD microservice environment without manually wiring the application infrastructure.

The demo includes:

- Moleculer.js
- API Gateway
- CRUD `articles` service
- MongoDB
- NATS
- Traefik
- Prometheus
- Docker Compose

The demo uses the provided configuration files:

```text
examples/config/init-project/demo.json
examples/config/add-service/demo.json
```

> [!IMPORTANT]
>  Before starting the stack, add the following entries to your /etc/hosts file:
> ```
> 127.0.0.1       localhost wiwiki-backend.local prometheus.local
> ```


### 1. Generate the project

https://github.com/user-attachments/assets/40c787a0-6d7d-4102-956e-3c1f3135e6b5

### 2. Use the generated API

Once the stack is running, the generated API is available at: 

[http://wiwiki-backend.local/api/v1/](http://wiwiki-backend.local/api/v1/)

You can test the generated routes using `curl`, `Postman`, or any other HTTP client.

The demo generates a minimal CRUD `articles` service, ready to be extended with your own fields and business logic.

https://github.com/user-attachments/assets/70ff4b98-9b3b-40d7-a79d-e0dca275ac82

### 3. Inspect Moleculer metrics with Prometheus

Prometheus is available at 

[http://prometheus.local/](http://prometheus.local/) 

From there, you can inspect the metrics exposed by Moleculer.js and the generated services.

https://github.com/user-attachments/assets/c72a0a86-f531-432b-8a43-87d69540788a


> [!NOTE]
> The demo uses a full configuration to showcase the available modules.
> Traefik and Prometheus are optional.

> [!TIP]
> Want to inspect the generated result without running the CLI?
> A complete demo project is available [here](https://github.com/AssilemSDN/moleculer-gen-demo).


## ✨ Why moleculer-gen?

Starting a microservice project usually means recreating the same foundation:

- application structure
- API Gateway
- database configuration
- message transport
- Docker services
- development tooling
- service boilerplate

`moleculer-gen` generates and maintains that foundation for you.