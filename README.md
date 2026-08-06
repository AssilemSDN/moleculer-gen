![Status](https://img.shields.io/badge/status-WIP-yellow) ![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

# moleculer-gen

> A **simple and modular CLI generator** to quickly create a functional **Node.js microservices project** with an operational API service, powered by [Moleculer.js](https://moleculer.services/).

Pick your **database**, message **transporter**, and optional infrastructure plugins like **Traefik** or **Prometheus**.

The generator produces a **ready-to-use Docker Compose setup** for development, so you can jump straight into coding your own microservices.

💡 Perfect for developers who want a fast, lightly opinionated setup to start building scalable Node.js microservices with Docker.

## Features

- Full scaffold for a **Moleculer.js** project
- Quickly add **CRUD services** with automatic model and API route generation
- **Auto-generates service**, **model**, **schema**, and **collection names** following consistent naming conventions
- Choose your **database**: MongoDB *(PostgreSQL coming soon)*
- Choose your **transporter**: NATS *(Redis coming soon)*
- Optional **plugins**: Traefik, Prometheus…
- Docker Compose ready for immediate dev
- Intuitive, modular CLI

⚠️ **Work In Progress (WIP)**
Some features are still under development.

## Table of contents

- [moleculer-gen](#moleculer-gen)
  - [Features](#features)
  - [Table of contents](#table-of-contents)
  - [Demo: CRUD microservice stack in under one minute - v0.0.6](#demo-crud-microservice-stack-in-under-one-minute---v006)
  - [Prerequisites](#prerequisites)
    - [For end users](#for-end-users)
    - [For contributors / developers](#for-contributors--developers)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Quick command summary](#quick-command-summary)
      - [Examples](#examples)
    - [Global options](#global-options)
    - [Command arguments and options](#command-arguments-and-options)
      - [Commands](#commands)
        - [1- `init`](#1--init)
        - [2- `add-service`](#2--add-service)
        - [3- `add-services`](#3--add-services)
        - [3- `validate` (WIP)](#3--validate-wip)
    - [Help](#help)
  - [Development](#development)
  - [Contributing](#contributing)
  - [LICENSE](#license)

## Demo: CRUD microservice stack in under one minute - v0.0.6

This demo shows how `moleculer-gen` can generate and start a full Moleculer.js CRUD microservice stack in under a minute, without writing boilerplate code.

The generated setup includes:
- `API Gateway`
- CRUD `articles` service
- `MongoDB`
- `Traefik`
- `Prometheus`
- `Docker Compose` setup

The demo uses the `demo.json` config files from:
```
./examples/config/init-project
./examples/config/add-service
```

Before starting the stack, add the following entries to your /etc/hosts file:
```
127.0.0.1       localhost wiwiki-backend.local prometheus.local
```

https://github.com/user-attachments/assets/40c787a0-6d7d-4102-956e-3c1f3135e6b5

Once the stack is running, you can test the API routes with `curl` or `Postman`.
- Base API URL: [http://wiwiki-backend.local/api/v1/](http://wiwiki-backend.local/api/v1/)

By default, generated entities do not include custom fields

https://github.com/user-attachments/assets/70ff4b98-9b3b-40d7-a79d-e0dca275ac82

Prometheus is available at [http://prometheus.local/](http://prometheus.local/). You can see all metrics exposed by Moleculer.js.

https://github.com/user-attachments/assets/c72a0a86-f531-432b-8a43-87d69540788a

A generated demo project is available [here](https://github.com/AssilemSDN/moleculer-gen-demo).

## Prerequisites

### For end users

| Requirement | Version | Notes |
| ----------- | ------- | ----- |
| [Node.js](https://nodejs.org/) | >= 20 | Required to run the CLI |
| [Docker](https://www.docker.com/) | >= 24 | To run the generated project |
| [Docker Compose](https://docs.docker.com/compose/) | v2+ | Bundled with Docker Desktop |
| [Make](https://www.gnu.org/software/make/) | any | Used to build and run the generated project (`make build`, `make start`) |
### For contributors / developers

Everything above, plus:

| Requirement                                   | Supported versions | Recommended     | Notes                                                 |
| --------------------------------------------- | ------------------ | --------------- | ----------------------------------------------------- |
| [Node.js](https://nodejs.org/)                | 20, 22, 24         | 22 or 24        | The supported versions are tested in CI               |
| [Yarn](https://yarnpkg.com/)                  | 4.18.0             | 4.18.0          | Managed through Corepack and pinned in `package.json` |
| [TypeScript](https://www.typescriptlang.org/) | >= 5               | Project version | Installed through the project dependencies            |

Enable Corepack before installing dependencies:

```bash
corepack enable
yarn --version
```

The reported Yarn version should match the version declared in the `packageManager` field of `package.json`.
## Installation

Run the published CLI directly with `npx`:

```bash
npx moleculer-gen init
```

For contributors, clone the repository and install its dependencies using the pinned Yarn version:

```bash
git clone https://github.com/AssilemSDN/moleculer-gen.git
cd moleculer-gen

corepack enable
yarn install --immutable
```

This project uses Yarn 4. Use Yarn to manage project dependencies and avoid running `npm install`, as it may create lockfile conflicts.

The `npm link` command is only used to expose the local CLI binary during development.

## Usage

```sh
npx moleculer-gen [options] [command]
```


### Quick command summary

| Command                                   | Mode        | Description                                                                 |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `moleculer-gen init`                      | Interactive | Create a new Moleculer project using prompts                                |
| `moleculer-gen init <config-file>`        | Config file | Create a new project from a JSON config file                                |
| `moleculer-gen add-service`               | Interactive | Add one service using prompts                                               |
| `moleculer-gen add-service <config-file>` | Config file | Add one service from a JSON config file                                     |
| `moleculer-gen validate`                  | Validation  | Check whether the current folder looks like a valid `moleculer-gen` project |

#### Examples

```sh
# Create a project interactively
npx moleculer-gen init

# Create a project from config
npx moleculer-gen init examples/config/init-project/minimal.json

# Add a service interactively
npx moleculer-gen add-service

# Add a service from config
npx moleculer-gen add-service examples/config/add-service/crud_full.json

# Validate the generated project
npx moleculer-gen validate
```

### Global options

| Option            | Description                                 |
| ----------------- | ------------------------------------------- |
| `-V`, `--version` | Show the CLI version                        |
| `--debug`         | Enable debug logging                        |
| `--quiet`         | Show only errors                            |
| `-h`, `--help`    | Show help for the CLI or a specific command |

### Command arguments and options

The following positional argument can be used to skip interactive prompts (config-based generation):

| Argument        | Commands              | Description                                           |
| --------------- | --------------------- | ----------------------------------------------------- |
| `[config-file]` | `init`, `add-service` | Optional JSON config file used instead of prompts     |

The following option is available per generation command:

| Option      | Commands              | Description                            |
| ----------- | --------------------- | -------------------------------------- |
| `--dry-run` | `init`, `add-service` | Simulate actions without writing files |

#### Commands

Currently, `moleculer-gen` supports the following commands:

##### 1- `init`

`init` Initialize a **new Moleculer project**

```sh
# In the current folder
npx moleculer-gen init
```

**Steps during initialization**:
1. Enter project name
2. Choose a database (`mongodb`)
3. Choose a transporter (`nats`)
4. Select optional infrastructure plugins (`traefik`, `prometheus`)

**Example output**:

```sh
[INFO] 🚀 Starting project initialization...
✔ 🧱 Project name: My Project
✔ 💾 Choose a database: MongoDB
✔ 📦 Choose a transporter: NATS Message Broker
✔ ⚙️ Select optional infrastructure modules: Traefik Reverse Proxy
```

At the end, a project summary can be displayed:

```json
{
  "projectName": "My Project",
  "projectNameSanitized": "my-project",
  "database": "mongodb",
  "transporter": "nats",
  "plugins": ["traefik"]
}
```

| Setting                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `projectName`          | Name of the project as entered by the user         |
| `projectNameSanitized` | "Safe" name for files/folders (lowercase, hyphens) |
| `database`             | Selected database (`mongodb`)                      |
| `transporter`          | Selected message broker (`nats`)                   |
| `plugins`              | List of optional modules enabled (`traefik`, etc.) |

💡 You can use **JSON config files** to skip interactive prompts. Example configs are included in the `examples/config/init-project` folder.

```bash
npx moleculer-gen init examples/config/init-project/minimal.json
```

💡 For testing, you can use the `--dry-run` option.

```bash
npx moleculer-gen init examples/config/init-project/minimal.json --dry-run --debug
```

##### 2- `add-service`

`add-service` Add a **new service** to your **generated project**

```sh
npx moleculer-gen add-service
```

**Steps during service creation**:
1. Enter the service name (e.g., `articles`)
2. Is this a CRUD service? (Yes / No)
3. Expose CRUD operations via API Gateway? (Yes / No)

> 💡 **Automatic name generation**: The CLI generates default names for the service file, model file, model, schema, and collection based on the service name you provide. This ensures **consistent naming** across your project.
>
> All names follow consistent rules (singular/plural forms, kebab-case, PascalCase, camelCase).

> ✨ **Flexibility**: You can keep the generated names or modify them manually before finalizing, giving you full control over your project structure.

**Example of generated default names**:

| Key                    | Generated Name        |
| ---------------------- | --------------------- |
| `serviceFileName`      | `articles.service.js` |
| `serviceDirectoryName` | `articles`            |
| `modelFileName`        | `article.model.js`    |
| `modelName`            | `ArticleModel`        |
| `modelVariableName`    | `Article`             |
| `collectionName`       | `articles`            |
| `schemaName`           | `articleSchema`       |

**Example output**:

```sh
[INFO] 🚀 Starting service addition...
✔ Service name: articles
✔ Is this a CRUD service? Yes
✔ Expose CRUD operations via API Gateway? Yes
✔ Service file name: articles.service.js
✔ Service directory name: articles
✔ Model file name: article.model.js
✔ Model name: ArticleModel
✔ Schema name: articleSchema
✔ Collection/table name: articles
```

💡 You can use **JSON config files** to skip interactive prompts. Example configs are included in the `examples/config/add-service` folder.

```bash
npx moleculer-gen add-service examples/config/add-service/crud_full.json
```

💡 For testing, you can use the `--dry-run` option.

```bash
npx moleculer-gen add-service examples/config/add-service/crud_full.json --dry-run --debug
```

**Behavior with existing services**:

If a service already exists, `add-service` throws an error.

The existence guard checks:
- existing service declaration in `.moleculer-gen/config.json`
- existing service directory: `src/services/<serviceDirectoryName>/`
- existing Docker service file: `docker/services/<serviceName>.yaml`
- existing model file for CRUD services: `src/data/model/<modelFileName>`

```sh
[INFO] 🚀 Starting service addition...
[ERROR] Service "articles" already declared in .moleculer-gen/config.json
[ERROR] ❌ service addition failed.
```

##### 3- `add-services`

> **Availability**: this command will be available in the next release. 

`add-services` adds **multiple services** to your **generated project** from a single JSON config file.

Unlike `add-service`, this command is **config-file only**. It does not provide an interactive prompt mode, to keep batch generation simple and predictable.


```sh
npx moleculer-gen add-services examples/config/add-services/demo.json
[2026-07-12T10:35:26.125Z] [INFO] 🚀 Starting batch services addition...
[2026-07-12T10:35:26.191Z] [INFO] 🎉 batch services addition completed successfully!
[2026-07-12T10:35:26.191Z] [INFO] Result:
 {
  createdCount: 2,
  skippedCount: 0,
  created: [ 'articles', 'categories' ],
  skipped: []
}
```

**Expected config format**:

```json
{
  "services": [
    {
      "serviceName": "articles",
      "serviceDirectoryName": "articles",
      "isCrud": true,
      "exposeApi": true
    },
    {
      "serviceName": "comments",
      "serviceDirectoryName": "comments",
      "isCrud": true,
      "exposeApi": true
    }
  ]
}
```

Each entry in `services` uses the same service configuration rules as `add-service`.

| Key                    | Required | Description                                              |
| ---------------------- | -------- | -------------------------------------------------------- |
| `serviceName`          | Yes      | Name of the service to generate                          |
| `serviceDirectoryName` | No       | Target directory name under `src/services/`              |
| `isCrud`               | No       | Whether to generate CRUD-related files                   |
| `exposeApi`            | No       | Whether to expose CRUD operations through the API Gateway |

When optional names are omitted, `moleculer-gen` generates default names using the same naming conventions as `add-service`.

**Behavior with existing services**:

If a service already exists, `add-services` skips it and continues with the next service.

Unexpected errors still stop the command.

The existence guard checks are the same as for `add-service`.

```sh
[2026-07-12T10:37:35.020Z] [INFO] 🚀 Starting batch services addition...
[2026-07-12T10:37:35.041Z] [WARN] Service "articles" already exists, skipping
[2026-07-12T10:37:35.041Z] [WARN] Service "categories" already exists, skipping
[2026-07-12T10:37:35.041Z] [WARN] No service was added. All services were skipped.
[2026-07-12T10:37:35.041Z] [INFO] ⚠️ batch services addition completed with warnings.
[2026-07-12T10:37:35.041Z] [INFO] Result:
 {
  createdCount: 0,
  skippedCount: 2,
  created: [],
  skipped: [ 'articles', 'categories' ]
}
```

```sh
[2026-07-12T10:37:09.864Z] [INFO] 🚀 Starting batch services addition...
[2026-07-12T10:37:09.886Z] [WARN] Service "articles" already exists, skipping
[2026-07-12T10:37:09.899Z] [WARN] Some services were skipped because they already exist: articles
[2026-07-12T10:37:09.899Z] [INFO] ⚠️ batch services addition completed with warnings.
[2026-07-12T10:37:09.899Z] [INFO] Result:
 {
  createdCount: 1,
  skippedCount: 1,
  created: [ 'categories' ],
  skipped: [ 'articles' ]
}
```


##### 3- `validate` (WIP)

`validate` checks whether the current folder looks like a valid project generated by `moleculer-gen`.

```sh
npx moleculer-gen validate
```

Current checks:
- `.moleculer-gen/config.json` exists
- The config file is readable and valid JSON
- The config file has the expected basic structure

**Example outputs:**

- Successful check
```sh
[INFO] 🚀 Starting project validation...
[INFO] Checking .moleculer-gen/config.json...
[INFO] .moleculer-gen/config.json structure is valid
[INFO] Project validation completed successfully.
```

- Failed check
```sh                                            
[INFO] 🚀 Starting project validation...
[INFO] Checking .moleculer-gen/config.json...
[ERROR] Missing .moleculer-gen/config.json. Are you inside a project generated by moleculer-gen?
[ERROR] Project validation failed with 1 error(s).
[ERROR] ❌ project validation failed.
```

### Help

```sh
# General CLI help
moleculer-gen --help
```
## Development

Clone the repository and install the dependencies:

```bash
git clone https://github.com/AssilemSDN/moleculer-gen.git
cd moleculer-gen

corepack enable
yarn install --immutable
```

Build the TypeScript modules:

```bash
yarn build
```

Link the local CLI globally for testing:

```bash
npm link
```

> Yarn 4's `yarn link` command does not create a global CLI link like Yarn Classic did. Use `npm link` to expose the local `moleculer-gen` executable.

Run the CLI directly:

```bash
moleculer-gen --help
moleculer-gen init
moleculer-gen add-service
moleculer-gen add-services examples/config/add-services/demo.json
moleculer-gen validate
```

Simulate generation without writing files:

```bash
moleculer-gen init --dry-run --debug
```

Run the project checks:

```bash
yarn lint
yarn build
yarn test
yarn test:integration
```

Audit production dependencies:

```bash
yarn audit:prod
```

Audit all direct and transitive dependencies:

```bash
yarn audit
```

Inspect the contents of the npm package:

```bash
yarn pack --dry-run
```

Remove the global development link when finished:

```bash
npm unlink --global moleculer-gen
```

## Contributing

Contributions are welcome!

If you'd like to improve `moleculer-gen`, feel free to fork the repo and open a pull request.

Suggestions, bug reports, and feature requests are also appreciated — open an issue to discuss ideas. See the [CONTRIBUTING](./CONTRIBUTING.md) file for details.

## LICENSE

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
