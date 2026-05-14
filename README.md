# CalmSEO MCP Server Tools

This repository contains public tool definitions and a lightweight mock implementation for tools that are part of the CalmSEO MCP server.

The hosted production MCP server includes auth, billing, credit metering, DataForSEO access, caching, and provider orchestration that are not duplicated in this repository.

## Hosted Server

Use the CalmSEO hosted MCP server URL from the CalmSEO dashboard or docs when connecting production clients.

The hosted server uses OAuth and can access SEO data for the signed-in CalmSEO account according to the scopes granted during authorization.

## Project Scope

This repo is focused on:

- Public MCP tool schemas and behavior examples
- A local mock MCP server for development and demos
- Example prompts and client setup notes
- Privacy, security, and contribution documentation

This repo intentionally does not contain:

- Billing or credit metering
- DataForSEO account logic or credentials
- OAuth handoff internals
- Production deployment code
- CalmSEO dashboard code
- Database schema or migrations
- Private provider orchestration

## Quick Start

Install dependencies:

```sh
pnpm install
```

Typecheck:

```sh
pnpm lint
```

Run the local mock MCP server with MCP Inspector:

```sh
pnpm dev
```

Run the mock server over stdio:

```sh
pnpm start
```

## Tools

The local mock server implements the same public tool names as the hosted CalmSEO MCP server:

- `serp_search`: Google or Bing organic SERP search with compact ranking results.
- `keyword_search_volume`: Google Ads search volume, CPC, and competition for keyword batches.
- `keyword_ideas`: Keyword expansion ideas for seed terms.
- `ranked_keywords`: Keywords a domain, subdomain, or URL ranks for in Google.
- `page_audit`: Single-URL on-page SEO audit.

The mock server returns deterministic example data and never calls external providers.

See [docs/tool-reference.md](docs/tool-reference.md) for tool inputs and response examples.

## Client Setup

For local development with Claude Code:

```sh
claude mcp add --scope user calmseo-mock --command "pnpm --dir /path/to/calmseo-mcp start"
```

For Codex CLI or other MCP clients, configure a stdio server that runs:

```sh
pnpm start
```

from this repository.

## Related Docs

- [Tool reference](docs/tool-reference.md)
- [Example prompts](docs/example-prompts.md)
- [Privacy and security](docs/privacy-security.md)
- [Contributing](CONTRIBUTING.md)
