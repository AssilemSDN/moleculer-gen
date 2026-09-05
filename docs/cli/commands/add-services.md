## `add-services`

Add multiple services to an existing `moleculer-gen` project from a JSON configuration.

The command must be run from the project root.

### Usage

From a JSON configuration:

```bash
npx moleculer-gen add-services <config-file>
```

Preview the generation without writing files:

```bash
npx moleculer-gen add-services <config-file> --dry-run
```

### Configuration

The configuration must contain a non-empty `services` array.

Each service uses the same configuration and naming rules as `add-service`.

Example:

```json
{
  "services": [
    {
      "serviceName": "articles",
      "isCrud": true,
      "exposeApi": true
    },
    {
      "serviceName": "categories",
      "isCrud": true
    },
    {
      "serviceName": "notifications"
    }
  ]
}
```

An empty `services` array is invalid.

### Output

Each service generates the same files and configuration as `add-service`, depending on its options.

Services are processed sequentially.

If a service conflicts with an existing service or generated file, it is skipped and generation continues with the remaining services.

For example:

```text
Skipped services: articles

2 services added (categories, notifications) - 1 service skipped (articles)
```

Other generation errors stop the operation.

With `--dry-run`, planned changes and skipped services are reported without modifying files.
