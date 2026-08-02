# FAQ & resolução de problemas

### Preciso de ter o LaTeX instalado?

Só para a ferramenta `compile`. O `check_document` e o `parse_log` são análise estática pura e
funcionam **sem TeX instalado**. O `compile` usa `latexmk`/`pdflatex` se existirem e devolve
`available: false` com orientação caso contrário — nunca lança exceção por falta de engine.

### O servidor não aparece no meu assistente

Confirma que `npx -y mcp-latex` arranca isolado (`mcp-latex ready (stdio)` no stderr), verifica
a config MCP e reinicia o cliente. É necessário Node 20+.

### O `check_document` marca uma referência que claramente existe

Faz o match de `\label{...}` com `\ref/\eqref/\autoref/\cref/...`. Se o teu label estiver
definido num ficheiro que não passaste, inclui o código completo, ou passa o documento
combinado. Código comentado (`% ...`) é ignorado de propósito.

### Não apanhou um erro real do compilador

O `check_document` é análise estática, não um compilador. Para erros reais, corre o `compile`
(ou o teu build) e passa o `.log` ao `parse_log`.

### Consegue corrigir o meu documento automaticamente?

O servidor dá ao assistente resultados estruturados; o assistente faz as edições. Essa
separação mantém a ferramenta segura e previsível.

### Que engines são suportados?

`latexmk` (preferido) e `pdflatex`. Outros podem ser adicionados atrás da mesma interface —
PRs bem-vindos.
