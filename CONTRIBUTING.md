# Contributing

Contributions are welcome!

## Prerequisites

* Node.js 20, 22, or 24
* Node.js 22 or 24 is recommended
* Corepack
* Git

The project uses the Yarn version pinned in the `packageManager` field of `package.json`.

## Local setup

Fork the repository, then clone your fork:

```bash
git clone https://github.com/<your-username>/moleculer-gen.git
cd moleculer-gen
```

Enable Corepack and install the dependencies without modifying the lockfile:

```bash
corepack enable
yarn install --immutable
```

Verify the active toolchain:

```bash
node --version
yarn --version
```

The reported Yarn version should match the version declared in the `packageManager` field of `package.json`.

## Development workflow

1. Create a branch from `main`.
2. Implement your changes.
3. Add or update tests when required.
4. Run the project checks.
5. Commit your changes using a clear commit message.
6. Push the branch and open a pull request.

## Branch naming convention

Branch names must follow this format:

```text
<type>/<issue-number>-<short-description>
```

Where:

- `<type>` uses a Conventional Commits-style keyword describing the nature of the change.
- `<issue-number>` is the related GitHub issue number.
- `<short-description>` briefly describes the change using lowercase kebab-case.

### Allowed types

| Type       | Usage                                                |
| ---------- | ---------------------------------------------------- |
| `feat`     | Add a new feature                                    |
| `fix`      | Fix a bug                                            |
| `docs`     | Update documentation only                            |
| `test`     | Add or update tests                                  |
| `refactor` | Restructure code without changing its behavior       |
| `chore`    | Maintenance, dependencies, tooling, or configuration |
| `ci`       | Update GitHub Actions or other CI configuration      |
| `build`    | Update the build system or packaging                 |
| `perf`     | Improve performance                                  |
| `security` | Fix or improve a security-related issue              |

### Examples

```text
feat/42-add-redis-transporter
fix/87-handle-invalid-config
docs/91-update-installation-guide
test/102-add-service-integration-tests
chore/23-yarn-4-migration
ci/104-add-node-version-matrix
security/115-validate-output-paths
```

Keep branch names concise and descriptive.

Avoid:

```text
my-branch
work-in-progress
fix-stuff
feature/new-feature
```

When no GitHub issue exists, create one before starting significant work so that the branch and pull request can be linked to it.


## Run the CLI locally

Build the TypeScript modules:

```bash
yarn build
```

Expose the local CLI as a global command:

```bash
npm link
```

Yarn 4's `yarn link` command does not create a global CLI link like Yarn Classic did. The project therefore uses `npm link` for local CLI development.

You can then run:

```bash
moleculer-gen --help
moleculer-gen init
moleculer-gen add-service
moleculer-gen validate
```

Remove the global link when it is no longer needed:

```bash
npm unlink --global moleculer-gen
```

## Required checks

Run the following commands before opening a pull request:

```bash
yarn install --immutable
yarn lint
yarn build
yarn test
yarn test:integration
yarn audit:prod
yarn pack --dry-run
```

Run the complete audit of direct and transitive dependencies with:

```bash
yarn audit
```

## Pull requests

* Keep pull requests focused on one issue or objective.
* Link the related issue in the pull request description.
* Add or update tests when behavior changes.
* Update the documentation when commands, configuration, or prerequisites change.
* Do not commit `node_modules`, generated package archives, `.yarn/cache`, or `.yarn/install-state.gz`.

Use the following syntax in the pull request description to automatically close an issue after merging:

```
Closes #123
```

Suggestions, bug reports, and feature requests can be submitted through GitHub Issues.
