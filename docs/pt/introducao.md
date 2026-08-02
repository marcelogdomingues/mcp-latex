# Começar & configurar o cliente

O `mcp-latex` é um servidor [Model Context Protocol](https://modelcontextprotocol.io).
Regista-lo num cliente MCP (um assistente de IA), que depois chama as suas ferramentas.

## Requisitos

- Node.js 20 ou superior
- Um engine TeX (`latexmk`/`pdflatex`) só é necessário para a ferramenta `compile`; o
  `check_document` e o `parse_log` funcionam sem ele.

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

`.mcp.json` na raiz do projeto (ou `claude mcp add`):

```json
{ "mcpServers": { "latex": { "command": "npx", "args": ["-y", "mcp-latex"] } } }
```

## Experimentar sem cliente

```bash
npx @modelcontextprotocol/inspector npx -y mcp-latex
```

Chama `check_document` com `{ "source": "See \\ref{missing}." }`.

## Correr a partir do código

```bash
git clone https://github.com/marcelogdomingues/mcp-latex
cd mcp-latex
npm install
npm start
npm test
```

## Exemplos de prompts

- *"Verifica a minha tese quanto a referências indefinidas e ambientes desequilibrados."*
- *"Faz o parsing deste log e diz-me o primeiro erro real e a linha."*
- *"Compila o main.tex e corrige o que falhar."*
