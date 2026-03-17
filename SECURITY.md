# Security Policy

## Supported Versions

This project is currently maintained on the latest `main` branch.

## Reporting a Vulnerability

If you discover a security issue, please open a private security advisory in GitHub when possible.
If that's not available, open an issue without exploit details and request a private follow-up channel.

Please include:

- A clear description of the impact.
- Reproduction steps.
- Suggested mitigations (if known).

## Secure-by-default guidance for generated projects

The generated boilerplate is a learning-focused starter and should be hardened before production use.
At minimum:

- Keep dependencies updated (`npm audit`, Dependabot/Renovate).
- Add Content Security Policy headers at deployment time.
- Review third-party scripts and assets.
- Use environment-specific configuration and secret management.
