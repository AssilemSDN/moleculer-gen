# Templates

This directory contains the file templates used to generate a Moleculer project.

The template tree is split into two main parts:

```txt
templates/
  static/
  dynamic/
```

## `static/`

The `static/` directory contains files that are copied as-is into the generated project.

No Mustache rendering is applied to these files.

Example:

```txt
templates/static/src/config/routes.config.js
```

is copied to:

```txt
src/config/routes.config.js
```

Use `static/` for files that do not depend on the project name, selected modules, generated services, or user answers.

## `dynamic/`

The `dynamic/` directory contains files rendered with Mustache before being written into the generated project.

Dynamic templates use the `.mustache` extension.

Example:

```txt
templates/dynamic/src/config/application.config.js.mustache
```

is rendered and written to:

```txt
src/config/application.config.js
```

Use `dynamic/` for files that need project-specific values, selected modules, generated configuration fragments, or user answers.

## Path convention

The directory structure under `static/` and `dynamic/` mirrors the structure of the generated project.

The generator removes the `static/` or `dynamic/` prefix when writing files to the target project.

For dynamic files, the `.mustache` extension is also removed.

Examples:

```txt
templates/static/Dockerfile
-> Dockerfile

templates/static/src/mixins/db.mixin.js
-> src/mixins/db.mixin.js

templates/dynamic/README.md.mustache
-> README.md

templates/dynamic/docker/config/prometheus.yml.mustache
-> docker/config/prometheus.yml
```

## Module-specific templates

Optional modules may also provide dynamic templates.

For example, the Prometheus plugin provides:

```txt
templates/dynamic/docker/config/prometheus.yml.mustache
templates/dynamic/src/config/modules/prometheus.config.js.mustache
```

When the Prometheus module is enabled, these files are rendered and added to the generated project.

The Prometheus Moleculer configuration file is also included dynamically in:

```txt
src/config/application.config.js
```
