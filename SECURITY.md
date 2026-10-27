# Security Policy

## Supported Versions

Security fixes are provided for the latest `@textmode/document` release from
`main`.

| Version / Channel                             | Supported |
| --------------------------------------------- | --------- |
| Latest npm release from `main`                | Yes       |
| Older releases and prereleases                | No        |
| Git snapshots, forks, and local modifications | No        |

If you are unsure whether your issue affects a supported version, report it
anyway. We would rather review a false alarm than miss a vulnerability.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately to
[hello@textmode.art](mailto:hello@textmode.art).

Do not open a public GitHub issue, pull request, discussion, or Discord thread
for security reports. Public reports can put users at risk before a fix is
available.

Include as much of the following as you can:

- A clear description of the issue and the affected decoder, schema, or package component
- The `@textmode/document` version, Node.js version, operating system, and consuming application or integration
- The document format version and a minimal JSON example or reproduction steps
- The expected impact and any realistic attack scenario
- Any mitigation ideas or candidate fixes you have already identified

Do not send secrets or private user documents unless the maintainers request a
secure method to share them. Clearly identify any sensitive material or exploit
details in your report.

## What to Expect

The maintainers will make a best effort to:

- Acknowledge receipt within 5 business days
- Triage and reproduce the issue
- Keep you informed as the investigation progresses
- Prepare and release a fix for a supported version when the issue is confirmed

Response times can vary with severity, maintainer availability, and the affected
code path.

## Disclosure Process

`@textmode/document` follows coordinated disclosure.

- Give the maintainers reasonable time to investigate and release a fix before
  public disclosure.
- After remediation, the project may publish a release note or GitHub security
  advisory that summarizes the issue.
- The project will credit the reporter when appropriate and when the reporter
  wants to be named.

## Scope

This policy covers security issues in:

- Source code in this repository
- Official npm releases of `@textmode/document`
- The published JSON Schemas, test fixtures, examples, and project-maintained
  documentation

This policy does not cover:

- Vulnerabilities in consumer applications, third-party services, runtimes, or
  dependencies outside this repository's control
- Security issues introduced only in downstream forks or private integrations
- General support questions, format questions, API usage questions, or feature
  requests

For non-security issues, use the [public GitHub issue tracker](https://github.com/humanbydefinition/textmode-document/issues).
