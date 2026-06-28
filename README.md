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
  - [Demo: A ready-to-use development setup](#demo-a-ready-to-use-development-setup)
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
        - [3- `validate` (WIP)](#3--validate-wip)
    - [Help](#help)
  - [Development](#development)
  - [Contributing](#contributing)
  - [LICENSE](#license)

## Demo: A ready-to-use development setup

This demo shows how `moleculer-gen` can generate and start a full Moleculer.js CRUD microservice stack in under a minute, without writing boilerplate code, under a minute.

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

A generated demo project is available here: [wiwiki-backend-demo](https://github.com/AssilemSDN/todo)

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

| Requirement | Version | Notes |
| ----------- | ------- | ----- |
| [Yarn](https://classic.yarnpkg.com/) | 1.x | Package manager (`yarn install`, `yarn test`) |
| [TypeScript](https://www.typescriptlang.org/) | >= 5 | Installed via devDependencies (`yarn build`) |

## Installation

```sh
# Run via npx (no installation required)
$ npx moleculer-gen init

# Or install globally
$ yarn global add moleculer-gen
```

> **Note for contributors**: this project uses **yarn** as its package manager.
> Please use `yarn` instead of `npm` to avoid lockfile conflicts.

```sh
$ yarn install
```

## Usage

```sh
$ npx moleculer-gen [options] [command]
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
$ npx moleculer-gen init

# Create a project from config
$ npx moleculer-gen init examples/config/init-project/minimal.json

# Add a service interactively
$ npx moleculer-gen add-service

# Add a service from config
$ npx moleculer-gen add-service examples/config/add-service/crud_full.json

# Validate the generated project
$ npx moleculer-gen validate
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
$ npx moleculer-gen init
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
$ npx moleculer-gen init examples/config/init-project/minimal.json
```

💡 For testing, you can use the `--dry-run` option.

```bash
$ npx moleculer-gen init examples/config/init-project/minimal.json --dry-run --debug
```

##### 2- `add-service`

`add-service` Add a **new service** to your **generated project**

```sh
$ npx moleculer-gen add-service
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
$ npx moleculer-gen add-service examples/config/add-service/crud_full.json
```

💡 For testing, you can use the `--dry-run` option.

```bash
$ npx moleculer-gen add-service examples/config/add-service/crud_full.json --dry-run --debug
```

##### 3- `validate` (WIP)

`validate` checks whether the current folder looks like a valid project generated by `moleculer-gen`.

```sh
$ npx moleculer-gen validate
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

```sh
# Clone the repo
$ git clone https://github.com/AssilemSDN/moleculer-gen.git
$ cd moleculer-gen

# Install dependencies
$ yarn install

# Build TypeScript modules
$ yarn build

# Link the CLI locally for testing
$ yarn link

# Run commands directly
$ moleculer-gen init
$ moleculer-gen add-service
$ moleculer-gen validate

# Run tests
$ yarn test

# Simulate without writing files
$ moleculer-gen init --dry-run --debug

# Unlink when done
$ yarn unlink moleculer-gen
```

## Contributing

Contributions are welcome!

If you'd like to improve `moleculer-gen`, feel free to fork the repo and open a pull request.

Suggestions, bug reports, and feature requests are also appreciated — open an issue to discuss ideas. See the [CONTRIBUTING](./CONTRIBUTING.md) file for details.

## LICENSE

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
