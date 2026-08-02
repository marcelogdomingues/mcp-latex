# Referência das ferramentas

## `check_document`

Análise estática de código LaTeX — sem precisar de TeX instalado.

- **Entrada:** `{ source?: string, path?: string }` (uma é obrigatória)
- **Saída:** `{ labels, references, citations, issues }`

Tipos de issue: `undefinedReference`, `duplicateLabel`, `unusedLabel`,
`unclosedEnvironment`, `mismatchedEnvironment`. Comentários (`% …`) são ignorados.

```json
{
  "labels": ["sec:intro"],
  "references": ["sec:intro"],
  "citations": ["smith2020"],
  "issues": [
    { "kind": "undefinedReference", "name": "fig:x", "message": "Reference to \"fig:x\" has no matching \\label" }
  ]
}
```

## `parse_log`

Faz o parsing de um ficheiro `.log` do LaTeX.

- **Entrada:** `{ logContent?: string, path?: string }` (uma é obrigatória)
- **Saída:** `{ errors, warnings, undefinedReferences, undefinedCitations, overfullBoxes, underfullBoxes }`

Cada erro é `{ message, line? }`, em que `line` é recuperado do marcador `l.<n>`.

## `compile`

Compila um ficheiro `.tex` se houver um engine TeX disponível.

- **Entrada:** `{ path: string, engine?: "latexmk" | "pdflatex" }`
- **Saída:** `{ ok, engine, available, message, log? }`

Se não houver engine instalado, `available` é `false` e a `message` explica como
instalar — a ferramenta nunca lança exceção por falta de engine, para o assistente
poder recuar para o `check_document`.

## Fluxo sugerido para um assistente

1. `check_document` para apanhar problemas estruturais instantaneamente.
2. `compile` para obter erros reais do compilador (se o TeX estiver instalado).
3. `parse_log` no log resultante para localizar o primeiro erro e a linha.
4. Editar o código; repetir.
