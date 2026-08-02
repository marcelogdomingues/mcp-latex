/** Static analysis of LaTeX source. Pure and dependency-free. */

export interface Issue {
  kind:
    | 'undefinedReference'
    | 'duplicateLabel'
    | 'unusedLabel'
    | 'unclosedEnvironment'
    | 'mismatchedEnvironment';
  message: string;
  name?: string;
}

export interface DocumentInfo {
  labels: string[];
  references: string[];
  citations: string[];
  issues: Issue[];
}

/** Removes LaTeX comments (unescaped `%` to end of line) so scans don't misfire. */
export function stripComments(source: string): string {
  return source
    .split(/\r?\n/)
    .map((line) => {
      let out = '';
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '%' && line[i - 1] !== '\\') break;
        out += line[i];
      }
      return out;
    })
    .join('\n');
}

function matchAll(source: string, re: RegExp): string[] {
  const out: string[] = [];
  for (const m of source.matchAll(re)) {
    // Reference/cite commands can take comma-separated keys.
    for (const key of m[1]!.split(',')) {
      const k = key.trim();
      if (k) out.push(k);
    }
  }
  return out;
}

/**
 * Analyzes LaTeX source: collects labels/refs/citations and reports common
 * issues (undefined refs, duplicate/unused labels, unbalanced environments).
 */
export function checkDocument(rawSource: string): DocumentInfo {
  const source = stripComments(rawSource);

  const labelsRaw = matchAll(source, /\\label\{([^}]+)\}/g);
  const references = matchAll(
    source,
    /\\(?:ref|eqref|autoref|cref|Cref|pageref|vref)\{([^}]+)\}/g,
  );
  const citations = matchAll(
    source,
    /\\(?:cite|citep|citet|citeauthor|parencite|textcite|footcite)\{([^}]+)\}/g,
  );

  const issues: Issue[] = [];

  // Duplicate labels.
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const label of labelsRaw) {
    if (seen.has(label)) {
      issues.push({ kind: 'duplicateLabel', name: label, message: `Label "${label}" is defined more than once` });
    } else {
      seen.add(label);
      labels.push(label);
    }
  }

  // Undefined references.
  const labelSet = new Set(labels);
  for (const ref of new Set(references)) {
    if (!labelSet.has(ref)) {
      issues.push({ kind: 'undefinedReference', name: ref, message: `Reference to "${ref}" has no matching \\label` });
    }
  }

  // Unused labels.
  const refSet = new Set(references);
  for (const label of labels) {
    if (!refSet.has(label)) {
      issues.push({ kind: 'unusedLabel', name: label, message: `Label "${label}" is never referenced` });
    }
  }

  // Environment balance.
  const stack: string[] = [];
  for (const m of source.matchAll(/\\(begin|end)\{([^}]+)\}/g)) {
    const kind = m[1];
    const env = m[2]!;
    if (kind === 'begin') {
      stack.push(env);
    } else {
      const top = stack.pop();
      if (top === undefined) {
        issues.push({ kind: 'mismatchedEnvironment', name: env, message: `\\end{${env}} without a matching \\begin` });
      } else if (top !== env) {
        issues.push({ kind: 'mismatchedEnvironment', name: env, message: `\\end{${env}} does not match \\begin{${top}}` });
      }
    }
  }
  for (const env of stack) {
    issues.push({ kind: 'unclosedEnvironment', name: env, message: `\\begin{${env}} is never closed` });
  }

  return { labels, references: [...new Set(references)], citations: [...new Set(citations)], issues };
}
