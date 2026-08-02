# FAQ & troubleshooting

### Do I need LaTeX installed?

Only for the `compile` tool. `check_document` and `parse_log` are pure static analysis and
work with **no TeX install**. `compile` uses `latexmk`/`pdflatex` if present and returns
`available: false` with guidance otherwise — it never throws for a missing engine.

### The server doesn't appear in my assistant

Verify `npx -y mcp-latex` starts standalone (`mcp-latex ready (stdio)` on stderr), check your
MCP config, and restart the client. Node 20+ required.

### `check_document` flags a reference that clearly exists

It matches `\label{...}` against `\ref/\eqref/\autoref/\cref/...`. If your label is defined in
a file you didn't pass, include the full source, or pass the combined document. Commented-out
code (`% ...`) is ignored on purpose.

### It didn't catch a real compiler error

`check_document` is static analysis, not a compiler. For real errors, run `compile` (or your
own build) and feed the `.log` to `parse_log`.

### Can it fix my document automatically?

The server gives the assistant structured findings; the assistant makes the edits. That
separation keeps the tool safe and predictable.

### Which engines are supported?

`latexmk` (preferred) and `pdflatex`. Others can be added behind the same interface — PRs
welcome.
