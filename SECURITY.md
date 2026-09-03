# Security Policy

## Supported versions

Security fixes are provided for the latest released version of `moleculer-gen`.

Older versions may not receive security updates. Before reporting a vulnerability, please verify that it is still reproducible with the latest release.

## Reporting a Vulnerability

Please do **not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

Use GitHub's private vulnerability reporting feature when available:

**Security → Advisories → Report a vulnerability**

If private vulnerability reporting is unavailable, contact the maintainer privately at:

**pufferfish.bloop@proton.me**

Please include, when possible:

- a clear description of the vulnerability;
- steps to reproduce it;
- the potential impact;
- any relevant logs, configuration, or proof of concept;
- a suggested mitigation or fix, if you have one.

Please avoid including sensitive information that is not required to reproduce the issue.

## Response

Reports are reviewed on a best-effort basis.

There is no guaranteed response or resolution timeframe, but security reports will be prioritized appropriately.

## Scope

Security reports are particularly useful for issues involving:

- path traversal or writes outside the intended project directory;
- command or code execution that is not expected behavior;
- unsafe handling of generated files or user-controlled configuration;
- dependency vulnerabilities that are exploitable through `moleculer-gen`;
- generated project defaults that introduce a concrete security vulnerability.

General bugs, feature requests, and non-security improvements should be reported through GitHub Issues instead.
