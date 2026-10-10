# Security Policy

## Supported Versions

This project is maintained on the default branch. Unless a release explicitly states otherwise, security fixes are applied to the latest maintained version; older snapshots may not receive fixes.

## Reporting a Vulnerability

Please **do not disclose suspected vulnerabilities in a public issue or pull request**.

- If GitHub's private vulnerability reporting is enabled for this repository, use the repository's **Security** tab to submit a private report.
- If private reporting is unavailable, contact the maintainer privately through the contact method on the maintainer's GitHub profile and ask for a secure disclosure channel.

Include the affected file or component, steps to reproduce, potential impact, and any relevant logs or proof of concept. Do not include real credentials, personal data, or production data in the report.

The maintainer should acknowledge a report when reasonably possible, investigate it, and coordinate any fix or public disclosure with the reporter. Please allow reasonable time to investigate before public disclosure.

## Secret-handling expectations

- Never commit `.env` files, tokens, private keys, or production credentials.
- Use `.env.example` only for clearly fake placeholders; keep real values in local environment files or an approved secrets manager.
- If a credential was committed or exposed, remove it from the active branch and assess Git history, but **also revoke or rotate the credential** when applicable. Deleting a file alone does not invalidate a credential.
- Treat browser/client keys as public: restrict them by allowed origins and APIs where the provider supports restrictions, and enforce authorization and row-level security on the backend.
