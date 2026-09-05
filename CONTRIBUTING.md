# Contributing

Contributions are welcome!

## Prerequisites

* Node.js 22.22.2+, 24.15.0+, or 26+
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

1. For significant changes, check for an existing GitHub issue or open one before starting.
2. Create a branch from `main`.
3. Implement your changes.
4. Add or update tests when behavior changes.
5. Run the project checks.
6. Commit your changes using clear commit messages.
7. Push the branch and open a pull request.

A GitHub issue is expected for changes such as:

* new features;
* non-trivial bug fixes;
* significant refactors;
* architectural changes;
* breaking changes;
* changes to user-facing behavior.

An issue is optional for small changes such as:

* documentation or typo fixes;
* isolated test changes;
* minor CI or tooling maintenance;
* dependency updates;
* other small maintenance changes.

## Branch naming convention

Use the following format:

```text
<type>/[issue-number-]<short-description>
```

Where:

* `<type>` describes the nature of the change.
* `[issue-number-]` is included when the change is associated with a GitHub issue.
* `<short-description>` briefly describes the change using lowercase kebab-case.

### Allowed types


| Type       | Usage                                                |
| ---------- | ---------------------------------------------------- |
| `feat`     | Add a new feature                                    |
| `fix`      | Fix a bug                                            |
| `docs`     | Update documentation only                            |
| `test`     | Add or update tests                                  |
| `refactor` | Restructure code without intended behavior changes   |
| `chore`    | Maintenance, dependencies, tooling, or configuration |
| `ci`       | Update GitHub Actions or other CI configuration      |
| `build`    | Update the build system or packaging                 |
| `perf`     | Improve performance                                  |
| `security` | Fix or improve a security-related issue              |

### Examples

Branches linked to an issue:

```text
feat/42-add-redis-transporter
fix/87-handle-invalid-config
refactor/103-simplify-module-registry
security/115-validate-output-paths
```

Branches that do not require an issue:

```text
docs/update-installation-guide
test/add-service-integration-tests
chore/update-dev-dependencies
ci/update-node-version-matrix
```

Keep branch names concise and descriptive.

Avoid:

```text
my-branch
work-in-progress
fix-stuff
feature/new-feature
```

Automated branches created by tools such as Dependabot or Release Please are not required to follow this convention.

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

Keep pull requests focused on one coherent objective.

If a GitHub issue exists:

* link it in the pull request description;
* use `Closes #123` when merging the pull request should automatically close it.

Example:

```text
Closes #123
```

Pull request titles must follow Conventional Commit syntax because pull requests are squash-merged and their titles become part of the project's release history.

Examples:

```text
feat: add Redis transporter
fix: reject duplicate service names
docs: update installation guide
test: cover batch validation
refactor: simplify module generation
chore: update development dependencies
ci: update Node.js test matrix
```

For breaking changes, use `!` and clearly describe the impact in the pull request:

```text
feat!: change generated project configuration format
```

Individual commits inside a pull request do not need to follow Conventional Commit syntax, but their messages should remain clear and understandable.

Before opening a pull request:

* add or update tests when behavior changes;
* update documentation when commands, configuration, generated output, or prerequisites change;
* mention breaking changes explicitly;
* make sure all required project checks pass;
* do not commit `node_modules`, generated package archives, `.yarn/cache`, or `.yarn/install-state.gz`.

All review conversations should be resolved before merging.


## Issues

Suggestions, bug reports, and feature requests can be submitted through GitHub Issues.

Before opening a new issue, check whether a similar issue already exists.

Security vulnerabilities should not be reported through a public GitHub issue. Follow the instructions in `SECURITY.md` instead.