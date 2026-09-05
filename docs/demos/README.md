# Demo recordings

The terminal demos used in the project documentation are generated with [VHS](https://github.com/charmbracelet/vhs).

The recording environment is containerized so demos can be reproduced without installing VHS, Node.js, Yarn, or `moleculer-gen` locally.

> Demo recordings use the canonical configuration files from `examples/config/*/demo.json`.

## Requirements

Only Docker is required:

```bash
docker --version
```

## Build the demo image

From the repository root:

```bash
docker build -f docs/demos/Dockerfile -t moleculer-gen-vhs .
```

The image contains the tooling required to execute the demo tapes, including:

* VHS;
* Node.js;
* Yarn;
* the current `moleculer-gen` source tree and dependencies.

## Generate a demo

Demo tapes are stored under:

```text
docs/demos/
```

Generated GIFs are written to:

```text
docs/images/
```

From the repository root:

```bash
docker run --rm -v "${PWD}/docs/images:/app/docs/images" moleculer-gen-vhs docs/demos/cli/demo-<name>.tape
```

For example:

```bash
docker run --rm -v "${PWD}/docs/images:/app/docs/images"  moleculer-gen-vhs docs/demos/cli/demo-interactive.tape
```


## Available demos

| Demo                     | Tape                                     | Output                               |
| ------------------------ | ---------------------------------------- | ------------------------------------ |
| Interactive generation   | `docs/demos/cli/demo-interactive.tape`   | `docs/images/demo-interactive.gif`   |
| Configuration generation | `docs/demos/cli/demo-configuration.tape` | `docs/images/demo-configuration.gif` |

## Temporary environment

Generation demos use isolated temporary directories under:

```text
/tmp/
```

For example:

```text
/tmp/moleculer-gen-vhs-demo
```

The temporary directory is removed and recreated at the beginning of each recording to keep demos deterministic.

Because the demo itself runs inside a disposable Docker container, the temporary environment is automatically discarded when the recording finishes.

Only the generated GIF is persisted to the host through the mounted:

```text
docs/images/
```

directory.

## Rebuilding after source changes

The demo image contains a copy of the current repository source.

After changing the CLI, templates, dependencies, or demo tooling, rebuild the image before recording again:

```bash
docker build -f docs/demos/Dockerfile -t moleculer-gen-vhs .
```

To force a completely clean rebuild:

```bash
docker build --no-cache -f docs/demos/Dockerfile -t moleculer-gen-vhs .
```
