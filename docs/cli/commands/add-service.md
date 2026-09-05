## `add-service`

Add a new service to an existing `moleculer-gen` project.

The command must be run from the project root.

### Usage

Interactive setup:

```bash
npx moleculer-gen add-service
```

From a JSON configuration:

```bash
npx moleculer-gen add-service <config-file>
```

Preview the generation without writing files:

```bash
npx moleculer-gen add-service --dry-run
npx moleculer-gen add-service <config-file> --dry-run
```

### Interactive setup

The interactive setup asks for:

* the service name;
* whether CRUD operations should be generated;
* the service file and directory names;
* whether a CRUD service should be exposed through the API Gateway;
* model and collection names when CRUD is enabled.

Names are automatically suggested from the service name and can be customized.

CRUD and API exposure are disabled by default.

### Configuration

A minimal configuration only requires `serviceName`:

```json
{
  "serviceName": "articles"
}
```

`isCrud` and `exposeApi` default to `false`.

To generate a CRUD service:

```json
{
  "serviceName": "articles",
  "isCrud": true
}
```

To also expose its CRUD actions through the API Gateway:

```json
{
  "serviceName": "articles",
  "isCrud": true,
  "exposeApi": true
}
```

Generated names can be overridden with:

* `serviceFileName`
* `serviceDirectoryName`
* `modelFileName`
* `modelName`
* `modelVariableName`
* `collectionName`
* `schemaName`

Model-related fields are only used for CRUD services.

### Naming

By default, names are derived from `serviceName`.

For example, `articles` generates:

| Field             | Default               |
| ----------------- | --------------------- |
| Service file      | `articles.service.js` |
| Service directory | `articles`            |
| Model file        | `article.model.js`    |
| Model             | `Article`             |
| Model variable    | `ArticleModel`        |
| Collection        | `articles`            |
| Schema            | `articleSchema`       |

### Output

Every service generates:

* its service files;
* its Docker service configuration;
* an entry in `.moleculer-gen/config.json`.

CRUD services also generate a model.

When `exposeApi` is enabled for a CRUD service, API Gateway routes are generated under:

```text
/api/v1/<serviceDirectoryName>
```

Existing services and generated files are not overwritten.
