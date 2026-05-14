# Contributing

This is a TypeScript project for the public CalmSEO MCP tool surface.

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer

## Project Structure

- `src/server.ts`: stdio MCP server entrypoint
- `src/tools.ts`: tool registration and schemas
- `src/mock-data.ts`: deterministic mock response builders
- `docs/`: public tool docs, example prompts, and security notes

## Development

Install dependencies:

```sh
pnpm install
```

Run type checks:

```sh
pnpm lint
```

Run with MCP Inspector:

```sh
pnpm dev
```

## Guidelines

- Keep this repo free of production credentials, billing logic, deployment details, and private provider orchestration.
- Keep mock responses deterministic so examples and tests are stable.
- Match hosted tool names and public schemas when making tool changes.
- Prefer built-in Web and Node APIs over extra dependencies unless a dependency removes meaningful complexity.
