# Privacy and Security

This public repo is a mock and reference implementation.

## Local Mock Server

- Does not call DataForSEO or other external SEO providers.
- Does not require OAuth.
- Does not read production credentials.
- Does not meter credits.
- Produces deterministic mock responses from the tool input.

## Hosted CalmSEO MCP Server

The hosted server is responsible for:

- OAuth authorization
- Account and workspace access controls
- Billing and credit metering
- Provider credentials and API access
- Caching and provider orchestration
- Production logging and abuse controls

Do not add production secrets, customer data, OAuth internals, billing code, provider credentials, or deployment configuration to this repository.
