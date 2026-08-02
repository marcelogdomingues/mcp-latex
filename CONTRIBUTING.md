# Contributing to mcp-latex

Thanks for helping! The goal is a small, reliable MCP server whose analysis works
without a TeX install.

## Setup

```bash
npm install
npm test        # unit + stdio integration tests
npm start       # run the server locally
```

## Adding a tool or check

1. Put pure logic in `src/lib/` with unit tests in `test/`.
2. Register the tool in `src/index.ts` with a `zod` schema and a clear description.
3. Add an integration assertion in `test/server.test.ts`.
4. Document it in the README and `docs/`.

## Guidelines

- Keep `check_document` and `parse_log` pure and TeX-free.
- Anything that shells out (like `compile`) must degrade gracefully when the tool is
  missing — never throw for a missing engine.
- Cite the source for LaTeX log/error patterns you encode.
