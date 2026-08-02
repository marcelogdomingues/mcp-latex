# mcp-latex

**Um servidor Model Context Protocol (MCP) para LaTeX.** Dá a um assistente de IA
(Claude Desktop, Claude Code, Cursor…) a capacidade de **verificar o teu documento
LaTeX**, **fazer parsing dos logs de compilação** e **compilar** — para que consiga
mesmo corrigir a tua tese ou artigo em vez de adivinhar. A análise estática funciona
**sem precisar de TeX instalado**.

🌍 [English](README.md) · **[Português](README.pt.md)** · 📚 [Documentação](docs/README.md)

[![CI](https://github.com/marcelogdomingues/mcp-latex/actions/workflows/ci.yml/badge.svg)](https://github.com/marcelogdomingues/mcp-latex/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/mcp-latex.svg)](https://www.npmjs.com/package/mcp-latex)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-server-6E56CF.svg)](https://modelcontextprotocol.io)

## Ferramentas

| Ferramenta | Descrição |
| --- | --- |
| `check_document` | Análise estática: refs indefinidas, labels duplicados/não usados, ambientes desequilibrados; lista labels/refs/citações. **Sem TeX.** |
| `parse_log` | Transforma um `.log` em erros, avisos, refs/citações indefinidas e boxes over/underfull estruturados. |
| `compile` | Compila um `.tex` com `latexmk`/`pdflatex` se instalado; devolve erros já parseados (gracioso se não houver engine). |

## Usar com Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "latex": { "command": "npx", "args": ["-y", "mcp-latex"] }
  }
}
```

Depois pede: *"Verifica a minha tese quanto a referências indefinidas e ambientes
desequilibrados"*, ou *"Compila o main.tex e corrige o primeiro erro"*.

## Porquê

Escrever uma tese em LaTeX é lutar com erros crípticos do compilador, `\ref`s soltos e
`\begin`/`\end` desalinhados. Um assistente de IA é ótimo a corrigir isto — **se**
conseguir ver os erros reais. Este servidor dá-lhe olhos estruturados sobre o teu
documento. Nasceu da dor de escrever uma tese de mestrado a sério.

## Correr localmente

```bash
npm install
npm start          # servidor stdio
npm test           # testes unitários + integração stdio
npm run build      # tsc -> dist/
```

Experimenta com o MCP Inspector:

```bash
npx @modelcontextprotocol/inspector npx -y mcp-latex
```

## Licença

MIT © Marcelo Domingues
