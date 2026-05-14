# CalmSEO MCP Server

CalmSEO gives AI assistants live SEO data through MCP: keyword research, SERP checks, competitor keyword reports, page audits, and Google Search Console insights.

- Website: [calmseo.com](https://calmseo.com)
- Hosted MCP endpoint: `https://mcp.calmseo.com/mcp`

## Connect CalmSEO

Use the hosted CalmSEO MCP server for real SEO data. The server handles OAuth, your CalmSEO account, credits, caching, provider access, and connected integrations.

Claude Code:

```sh
claude mcp add calmseo --transport http https://mcp.calmseo.com/mcp
```

Codex CLI:

```sh
codex mcp add calmseo --url https://mcp.calmseo.com/mcp
```

The hosted server uses OAuth and can access SEO data for the signed-in CalmSEO account according to the scopes granted during authorization.

## What You Can Ask

```text
Which Google Search Console sites do I have connected?
```

```text
Show my top queries from Google Search Console over the last 28 days and group them by intent.
```

```text
Find pages with high impressions but low click-through rate, then suggest title improvements.
```

```text
Compare the top ranking pages for "technical seo audit" with our Search Console queries.
```

```text
Audit https://example.com/blog/seo-checklist and prioritize the fixes by SEO impact.
```

```text
Find keyword ideas for "local seo" and estimate which ones are worth writing about first.
```

## About This Repository

This repository contains public tool definitions and a lightweight mock implementation for tools that are part of the CalmSEO MCP server.

The hosted production MCP server includes auth, billing, credit metering, DataForSEO access, Google Search Console access, caching, and provider orchestration that are not duplicated in this repository.

## Project Scope

This repo is focused on:

- Public MCP tool schemas and behavior examples
- A local mock MCP server for development and demos
- Example prompts and local setup notes
- Privacy, security, and contribution documentation

This repo intentionally does not contain:

- Billing or credit metering
- DataForSEO account logic or credentials
- OAuth handoff internals
- Production deployment code
- CalmSEO dashboard code
- Database schema or migrations
- Private provider orchestration

## Local Mock Server

The local mock server is useful for testing MCP clients, examples, and tool schemas. It returns deterministic sample data and never calls external providers.

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

The local mock server implements these public CalmSEO tool names:

- `serp_search`: Google or Bing organic SERP search with compact ranking results.
- `keyword_search_volume`: Google Ads search volume, CPC, and competition for keyword batches.
- `keyword_ideas`: Keyword expansion ideas for seed terms.
- `ranked_keywords`: Keywords a domain, subdomain, or URL ranks for in Google.
- `page_audit`: Single-URL on-page SEO audit.

The hosted CalmSEO MCP server also includes Google Search Console tools when your account has a connected property:

- `gsc_list_sites`: List available Search Console sites.
- `gsc_search_analytics`: Query Search Console performance data with dimensions and filters.
- `gsc_top_queries`: Find top queries by clicks, impressions, CTR, or position.
- `gsc_top_pages`: Find top pages by clicks, impressions, CTR, or position.
- `gsc_page_queries`: Show queries driving traffic to a specific page.
- `gsc_list_sitemaps`: List submitted sitemaps for a Search Console site.

See [docs/tool-reference.md](docs/tool-reference.md) for tool inputs and response examples.

## Local Client Setup

For local development with Claude Code:

```sh
claude mcp add calmseo-mock --scope user -- pnpm --dir /path/to/calmseo-mcp start
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
