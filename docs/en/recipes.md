# Recipes

## Add to your assistant

```json
{ "mcpServers": { "latex": { "command": "npx", "args": ["-y", "mcp-latex"] } } }
```

## Prompts that map to each tool

- *"Check thesis/main.tex for undefined references and unbalanced environments."* → `check_document`
- *"Compile thesis/main.tex and fix the first error."* → `compile` + `parse_log`
- *"Parse build/main.log and list real errors with line numbers."* → `parse_log`

## Lint LaTeX in CI (no TeX needed)

```ts
// scripts/lint-latex.ts — uses the library directly
import { readFileSync } from 'node:fs';
import { checkDocument } from 'mcp-latex/dist/lib/document.js';

const info = checkDocument(readFileSync('thesis/main.tex', 'utf8'));
if (info.issues.length) {
  for (const i of info.issues) console.error(`${i.kind}: ${i.message}`);
  process.exit(1);
}
```

## Turn a compiler log into structured errors

```ts
import { readFileSync } from 'node:fs';
import { parseLog } from 'mcp-latex/dist/lib/log.js';

const { errors, undefinedReferences } = parseLog(readFileSync('main.log', 'utf8'));
console.log(errors[0]); // { message: 'Undefined control sequence.', line: 42 }
```

## Suggested assistant loop

1. `check_document` → catch structural issues instantly.
2. `compile` → real compiler errors (if TeX installed).
3. `parse_log` → pinpoint the first error + line.
4. Edit, repeat.
