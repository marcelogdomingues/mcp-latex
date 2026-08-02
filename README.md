# mcp-latex

**A Model Context Protocol (MCP) server for LaTeX.** Give an AI assistant (Claude
Desktop, Claude Code, Cursor…) the ability to **check your LaTeX document**, **parse
compiler logs**, and **compile** — so it can actually fix your thesis or paper instead
of guessing. Static analysis works with **no TeX install required**.

🌍 **[English](README.md)** · [Português](README.pt.md) · 📚 [Documentation](docs/README.md)

[![CI](https://github.com/marcelogdomingues/mcp-latex/actions/workflows/ci.yml/badge.svg)](https://github.com/marcelogdomingues/mcp-latex/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/mcp-latex.svg)](https://www.npmjs.com/package/mcp-latex)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-server-6E56CF.svg)](https://modelcontextprotocol.io)

## Tools

| Tool | Description |
| --- | --- |
| `check_document` | Static analysis: undefined refs, duplicate/unused labels, unbalanced environments; lists labels/refs/citations. **No TeX needed.** |
| `parse_log` | Turns a `.log` into structured errors, warnings, undefined refs/citations, over/underfull boxes. |
| `compile` | Compiles a `.tex` with `latexmk`/`pdflatex` if installed; returns parsed errors (graceful if no engine). |

## Use with Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "latex": { "command": "npx", "args": ["-y", "mcp-latex"] }
  }
}
```

Then ask: *"Check my thesis for undefined references and unbalanced environments,"* or
*"Compile main.tex and fix the first error."*

## Why

Writing a thesis in LaTeX means fighting cryptic compiler errors, dangling `\ref`s and
`\begin`/`\end` mismatches. An AI assistant is great at fixing these — **if** it can
see the actual errors. This server gives it structured eyes on your document. Built
from the pain of writing a real master's thesis.

## Run locally

```bash
npm install
npm start          # stdio server
npm test           # unit + stdio integration tests
npm run build      # tsc -> dist/
```

Try it with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector npx -y mcp-latex
```

## License

MIT © Marcelo Domingues
