![WIP](https://img.shields.io/badge/status-WIP-yellow)

# moleculer-gen

> A simple CLI generator for [Moleculer.js](https://moleculer.services/) projects with Docker Compose setup for development.

## Description

⚠️ **Work In Progress (WIP)**  
`moleculer-gen` is a Node.js CLI tool that helps you scaffold a Moleculer-based microservices project quickly.  
**Some features are still under development**.

## Usage
```sh
$ moleculer-gen [options] [command]
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

Currently, ``moleculer-gen`` supports the following command:

``init``
Initialize a **new Moleculer project**.
```sh
# In the current folder
moleculer-gen init
```
**Steps during initialization**:
- Enter project name
- Choose database (MongoDB, PostgreSQL, etc.)
- Choose transporter (NATS, Redis, etc.)
- Select optional infrastructure modules (Traefik, Prometheus, etc.)

At the end, a project summary is displayed:
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

### Help
```sh
# General CLI help
moleculer-gen --help
```