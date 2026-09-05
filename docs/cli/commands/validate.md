# `validate`

Validate the configuration of an existing `moleculer-gen` project.

The command must be run from the project root.

## Usage

```bash
npx moleculer-gen validate
```

The command currently has no command-specific options.

## Validation

`validate` checks `.moleculer-gen/config.json` and verifies that it contains the expected project metadata.

The following fields are validated:

* `projectName`
* `projectNameSanitized`
* `database`
* `transporter`
* `plugins`, when present
* `services`, when present

A successful validation reports:

```text
.moleculer-gen/config.json
Project validated
```

Validation errors return exit code `1`.

## Limitations

**WIP** : Validation currently only checks the project configuration.

It does not validate generated files, external services, infrastructure health, API routes, or runtime behavior.
