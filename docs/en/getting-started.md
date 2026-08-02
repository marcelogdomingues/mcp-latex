# Getting started & client setup

`mcp-latex` is a [Model Context Protocol](https://modelcontextprotocol.io) server. You
register it with an MCP client (an AI assistant), which then calls its tools.

## Requirements

- Node.js 20 or newer
- A TeX engine (`latexmk`/`pdflatex`) is **only** needed for the `compile` tool;
  `check_document` and `parse_log` work without it.

## Claude Desktop

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "latex": { "command": "npx", "args": ["-y", "mcp-latex"] }
  }
}
```

## Claude Code

`.mcp.json` at your project root (or `claude mcp add`):

```json
{ "mcpServers": { "latex": { "command": "npx", "args": ["-y", "mcp-latex"] } } }
```

## Try it without a client

```bash
npx @modelcontextprotocol/inspector npx -y mcp-latex
```

Call `check_document` with `{ "source": "See \\ref{missing}." }`.

## Run from source

```bash
git clone https://github.com/marcelogdomingues/mcp-latex
cd mcp-latex
npm install
npm start
npm test
```

## Example prompts

- *"Check my thesis for undefined references and unbalanced environments."*
- *"Parse this build log and tell me the first real error and its line."*
- *"Compile main.tex, then fix whatever failed."*
