# CLI reference

`moleculer-gen` generates and extends Moleculer.js projects.

```bash
npx moleculer-gen <command>
```

## Commands

| Command | Mode | Description |
| --- | --- | --- |
| [`init`](./commands/init.md) | Interactive / config | Initialize a new Moleculer.js project |
| [`add-service`](./commands/add-service.md) | Interactive / config | Add one service to an existing project |
| [`add-services`](./commands/add-services.md) | Config | Add multiple services from a JSON configuration |
| [`validate`](./commands/validate.md) | Validation | Validate the project configuration |

## Global options

| Option          | Description                   |
| --------------- | ----------------------------- |
| `--debug`       | Enable debug logging          |
| `--quiet`       | Only display errors           |
| `-h, --help`    | Display help                  |
| `-V, --version` | Display the installed version |

For command-specific options and configuration formats, see the documentation for each command.


## Quick start

Create a project:

```bash
npx moleculer-gen init
cd <project-dir>
```

Add a service:

```bash
npx moleculer-gen add-service
```

Add multiple services:

```bash
npx moleculer-gen add-services ./services.json
```

Validate the project:

```bash
npx moleculer-gen validate
```

## Configuration files

`init`, `add-service`, and `add-services` can use JSON configuration files for reproducible generation.

```bash
npx moleculer-gen init ./project.json
npx moleculer-gen add-service ./service.json
npx moleculer-gen add-services ./services.json
```

## Preview changes

Use `--dry-run` to validate and preview generated filesystem changes without writing files.

```bash
npx moleculer-gen add-service ./service.json --dry-run
```

Supported by:

* `init`
* `add-service`
* `add-services`

