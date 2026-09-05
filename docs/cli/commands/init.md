## `init`

Create a new Moleculer.js project.

### Usage

Interactive setup:

```bash
npx moleculer-gen init
```

From a JSON configuration:

```bash
npx moleculer-gen init <config-file>
```

Preview the generation without writing files:

```bash
npx moleculer-gen init --dry-run
npx moleculer-gen init <config-file> --dry-run
```

### Interactive setup

The interactive setup asks for:

* the project name;
* the output directory;
* the database;
* the transporter;
* optional infrastructure modules.

The output directory defaults to a sanitized version of the project name.

Currently available modules are:

| Category       | Module     |
| -------------- | ---------- |
| Database       | MongoDB    |
| Transporter    | NATS       |
| Infrastructure | Traefik    |
| Observability  | Prometheus |

The API Gateway is included in every generated project.

### Configuration

A minimal configuration requires `projectName`, `database`, and `transporter`:

```json
{
  "projectName": "My Project",
  "database": "mongodb",
  "transporter": "nats"
}
```

Optional fields:

* `projectNameSanitized` — output directory name, derived from `projectName` when omitted;
* `plugins` — optional modules to enable, defaults to `[]`.

Example:

```json
{
  "projectName": "My Project",
  "projectNameSanitized": "my-project",
  "database": "mongodb",
  "transporter": "nats",
  "plugins": [
    "traefik",
    "prometheus"
  ]
}
```

Supported plugin keys:

* `traefik`
* `prometheus`

> Interactive defaults may differ from configuration-file defaults. Omitting `plugins` from a JSON configuration enables no optional plugins.

### Output

The project is generated in:

```text
./<projectNameSanitized>
```

An existing non-empty destination directory is not overwritten.

After generation:

```bash
cd ./<projectNameSanitized>
npx moleculer-gen add-service
make build
make start
```
