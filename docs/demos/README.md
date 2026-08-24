# Demo recordings

The terminal demos used in the project documentation are generated with [VHS](https://github.com/charmbracelet/vhs).

> Demo recordings use the canonical configuration files from `examples/config/*/demo.json`.

## Requirements

The following commands must be available:

```bash
vhs
moleculer-gen
```

## Generate the interactive demo

Run VHS from the repository root:

```bash
vhs docs/demos/demo-interactive.tape
```

The generated GIF is written to:

```text
docs/images/demo-interactive.gif
```

## Temporary environment

The demo runs inside:

```text
/tmp/moleculer-gen-vhs-demo
```

The directory is removed and recreated at the beginning of each recording.

The generated project is intentionally left in place after the recording so it can be inspected when debugging the demo.
