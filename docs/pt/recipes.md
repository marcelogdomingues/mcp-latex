# Receitas

## Adicionar ao teu assistente

```json
{ "mcpServers": { "latex": { "command": "npx", "args": ["-y", "mcp-latex"] } } }
```

## Prompts que mapeiam para cada ferramenta

- *"Verifica thesis/main.tex quanto a referências indefinidas e ambientes desequilibrados."* → `check_document`
- *"Compila thesis/main.tex e corrige o primeiro erro."* → `compile` + `parse_log`
- *"Faz parse de build/main.log e lista os erros reais com números de linha."* → `parse_log`

## Lint de LaTeX em CI (sem precisar de TeX)

```ts
// scripts/lint-latex.ts — usa a biblioteca diretamente
import { readFileSync } from 'node:fs';
import { checkDocument } from 'mcp-latex/dist/lib/document.js';

const info = checkDocument(readFileSync('thesis/main.tex', 'utf8'));
if (info.issues.length) {
  for (const i of info.issues) console.error(`${i.kind}: ${i.message}`);
  process.exit(1);
}
```

## Transformar um log do compilador em erros estruturados

```ts
import { readFileSync } from 'node:fs';
import { parseLog } from 'mcp-latex/dist/lib/log.js';

const { errors, undefinedReferences } = parseLog(readFileSync('main.log', 'utf8'));
console.log(errors[0]); // { message: 'Undefined control sequence.', line: 42 }
```

## Loop sugerido para o assistente

1. `check_document` → apanhar problemas estruturais instantaneamente.
2. `compile` → erros reais do compilador (se o TeX estiver instalado).
3. `parse_log` → localizar o primeiro erro + linha.
4. Editar, repetir.
