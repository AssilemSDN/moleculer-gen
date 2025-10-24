![Status](https://img.shields.io/badge/status-WIP-yellow) ![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen) ![License](https://img.shields.io/badge/license-MIT-lightgrey)



# moleculer-gen

> A **simple and modular CLI generator** to quickly create a functional **Node.js microservices project** with an operational API service, powered by [Moleculer.js](https://moleculer.services/). 


Pick your **database**, message **transporter**, and optional infrastructure plugins like **Traefik** or **Prometheus**.  

The generator produces a **ready-to-use Docker Compose setup** for development, so you can jump straight into coding your microservices.

💡 Perfect for developers who want a fast, opinionated setup to start building scalable Node.js microservices with Docker.

## ⚡ Features

- Full scaffold for a **Moleculer.js** project
- Quickly add **CRUD services** with automatic model and API route generation
- **Auto-generates service**, **model**, **schema**, and **collection names** following consistent naming conventions
- Choose your **database**: MongoDB, PostgreSQL…
- Choose your **transporter**: NATS, Redis…
- Optional **plugins**: Traefik, Prometheus…
- Docker Compose ready for immediate dev
Intuitive, modular CLI


⚠️ **Work In Progress (WIP)**  
Some features are still under development.

## 🚀 Installation
```sh
# Run via npx
$ npx moleculer-gen
```

## 💻 Usage
```sh
$ npx moleculer-gen [options] [command]
```

### Options

| Option            | Description                                 |
| ----------------- | ------------------------------------------- |
| `-V`, `--version` | Show the CLI version                        |
| `--debug`         | Enable debug logging                        |
| `--verbose`       | Enable verbose logging (info level)         |
| `--quiet`         | Show only errors                            |
| `-h`, `--help`    | Show help for the CLI or a specific command |

### Commands

Currently, ``moleculer-gen`` supports the following commands :

#### 1- ``init`` 

``init`` Initialize a **new Moleculer project**
```sh
# In the current folder
$ moleculer-gen init
```

**Steps during initialization**:
1. Enter project name
2. Choose a database (``mongodb``, ``postgres``, …)
3. Choose a transporter (``nats``, ``redis``, …)
4. Select optional infrastructure modules (``traefik, prometheus``, …)

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
| `projectNameSanitized` | “Safe” name for files/folders (lowercase, hyphens) |
| `database`             | Selected database (`mongodb`, `postgres`, etc.)    |
| `transporter`          | Selected message broker (`nats`, `redis`, etc.)    |
| `plugins`              | List of optional modules enabled (`traefik`, etc.) |

#### 2- ``add-service``

``add-service`` Add a **new service** to your **generated project**

```sh
$ npx moleculer-gen add-service
```

**Steps during service creation**:
1- Enter the service name (e.g., articles)
2- Is this a CRUD service? (Yes / No)
3- Expose CRUD operations via API Gateway? (Yes / No)

> 💡 **Automatic name generation**:
The CLI generates default names for the service file, model file, model, schema, and collection based on the service name you provide. This ensures **consistent naming** across your project. 

All names follow consistent rules (singular/plural forms, kebab-case, PascalCase, camelCase).

>✨ **Flexibility**: You can keep the generated names or modify them manually before finalizing, giving you full control over your project structure.

**Example of generated default names** :
| Key                    | Generated Name        |
| ---------------------- | --------------------- |
| `serviceFileName`      | `articles.service.js` |
| `serviceDirectoryName` | `articles`            |
| `modelFileName`        | `article.model.js`    |
| `modelName`            | `ArticleModel`        |
| `modelVariableName`    | `Article`             |
| `collectionName`       | `articles`            |
| `schemaName`           | `articleSchema`       |


**Example output** :
```sh
# All default names
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


### Help
```sh
# General CLI help
moleculer-gen --help
```