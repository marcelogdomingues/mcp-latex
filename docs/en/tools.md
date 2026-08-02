# Tools reference

## `check_document`

Static analysis of LaTeX source — no TeX install required.

- **Input:** `{ source?: string, path?: string }` (one is required)
- **Output:** `{ labels, references, citations, issues }`

Issue kinds: `undefinedReference`, `duplicateLabel`, `unusedLabel`,
`unclosedEnvironment`, `mismatchedEnvironment`. Comments (`% …`) are ignored.

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

Parses a LaTeX `.log` file.

- **Input:** `{ logContent?: string, path?: string }` (one is required)
- **Output:** `{ errors, warnings, undefinedReferences, undefinedCitations, overfullBoxes, underfullBoxes }`

Each error is `{ message, line? }`, where `line` is recovered from the `l.<n>` marker.

## `compile`

Compiles a `.tex` file if a TeX engine is available.

- **Input:** `{ path: string, engine?: "latexmk" | "pdflatex" }`
- **Output:** `{ ok, engine, available, message, log? }`

If no engine is installed, `available` is `false` and `message` explains how to install
one — the tool never throws for a missing engine, so an assistant can degrade to
`check_document`.

## Suggested workflow for an assistant

1. `check_document` to catch structural problems instantly.
2. `compile` to get real compiler errors (if TeX is installed).
3. `parse_log` on the resulting log to pinpoint the first error and line.
4. Edit the source; repeat.
