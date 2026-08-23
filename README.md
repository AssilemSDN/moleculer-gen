<div align="center">
  <img
    src="./docs/images/moleculer-gen.png"
    alt="moleculer-gen banner"
    width="900"
  />
</div>

<br />

<div align="center">

  [![CI](https://github.com/AssilemSDN/moleculer-gen/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AssilemSDN/moleculer-gen/actions/workflows/ci.yml)
  [![codecov](https://codecov.io/github/AssilemSDN/moleculer-gen/graph/badge.svg?token=IBG74CEDTK)](https://codecov.io/github/AssilemSDN/moleculer-gen)
  ![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2024%20%7C%2026-339933?logo=node.js&logoColor=white)
  ![Yarn](https://img.shields.io/badge/Yarn-4.18.0-2C8EBB?logo=yarn&logoColor=white)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
</div>


# { } moleculer gen

A **modular platform engineering CLI** for scaffolding and extending ready-to-run [Moleculer.js](https://moleculer.services/) microservice projects with Docker Compose and composable infrastructure modules.

Choose your database, message transporter, and optional infrastructure modules, then evolve the generated project as your architecture grows.

```bash
mkdir my-project 
cd my-project 
npx moleculer-gen init
```

## Why moleculer-gen?

`moleculer-gen` is designed for developers who want a **fast, modular, and lightly opinionated foundation** for building Moleculer.js microservices with Docker.

It aims to avoid two extremes:

* rebuilding the same development infrastructure for every project;
* adopting a heavy platform that becomes harder to modify than the application itself.

The generated project remains a **standard Moleculer.js project** — `moleculer-gen` handles the repetitive scaffolding without locking the application into a proprietary project format.

**Start small. Add infrastructure as your architecture evolves.**

## 🚀 Quick start

### Requirements

| Requirement                                        | Version        | Purpose                          |
| -------------------------------------------------- | -------------- | -------------------------------- |
| [Node.js](https://nodejs.org/)                     | `>= 22.13.0`   | Run the CLI                      |
| [Docker](https://www.docker.com/)                  | `>= 24`        | Run generated services           |
| [Docker Compose](https://docs.docker.com/compose/) | `v2+`          | Orchestrate the generated stack  |
| [Make](https://www.gnu.org/software/make/)         | Recent version | Build and manage the environment |

> No global installation is required.

### Create a project

Create an empty directory and run the CLI:

```bash
mkdir my-project
cd my-project

npx moleculer-gen init
```

The interactive setup lets you choose the infrastructure required by your project.

Once generated:

```bash
make build
make start
```

You can also skip the interactive prompts and use a JSON configuration file for reproducible generation:

```bash
npx moleculer-gen init examples/config/init-project/minimal.json
```

### Extend the project

Add a service interactively:

```bash
npx moleculer-gen add-service
```

Or generate multiple services from configuration:

```bash
npx moleculer-gen add-services examples/config/add-services/demo.json
```

## Modular by design

`moleculer-gen` is built around independent modules that can be composed when creating a project.

### Currently supported

| Category       | Module      |
| -------------- | ----------- |
| Database       | MongoDB     |
| Transporter    | NATS        |
| Backend        | API Gateway |
| Infrastructure | Traefik     |
| Observability  | Prometheus  |

Only the modules selected during initialization are included in the generated project.

This keeps generated environments focused while allowing `moleculer-gen` to evolve with additional databases, transporters, and infrastructure integrations.

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



## 🧰 CLI overview

```text
npx moleculer-gen [options] [command]
```

| Command        | Mode                 | Description                                     |
| -------------- | -------------------- | ----------------------------------------------- |
| `init`         | Interactive / config | Initialize a new Moleculer.js project           |
| `add-service`  | Interactive / config | Add one service to an existing project          |
| `add-services` | Config               | Add multiple services from a JSON configuration |
| `validate`     | Validation           | Validate the consistency of a generated project |

Generation commands support dry runs, allowing changes to be inspected before files are written.

For command options, configuration formats, generated files, and detailed examples, see the documentation.

## 📚 Documentation

The README is intentionally focused on discovering `moleculer-gen` and getting a project running quickly.

Detailed documentation lives under [`docs/`](./docs/).

### Command reference

* [`init`](./docs/cli/init.md)
* [`add-service`](./docs/cli/add-service.md)
* [`add-services`](./docs/cli/add-services.md)
* [`validate`](./docs/cli/validate.md)


## 🤝 Contributing

Contributions, bug reports, and feature proposals are welcome.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development setup and contribution guidelines.

## Security

For vulnerability reporting and security-related information, see [`SECURITY.md`](./SECURITY.md).

## License

`moleculer-gen` is distributed under the [MIT License](./LICENSE).
