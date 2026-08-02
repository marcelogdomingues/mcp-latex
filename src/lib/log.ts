/** Parsers for LaTeX compiler `.log` output. Pure and dependency-free. */

export interface LogError {
  message: string;
  line?: number;
}

export interface ParsedLog {
  errors: LogError[];
  warnings: string[];
  undefinedReferences: string[];
  undefinedCitations: string[];
  overfullBoxes: number;
  underfullBoxes: number;
}

/**
 * Extracts structured errors and warnings from a LaTeX `.log` file's contents.
 */
export function parseLog(logContent: string): ParsedLog {
  const lines = logContent.split(/\r?\n/);
  const errors: LogError[] = [];
  const warnings: string[] = [];
  const undefinedReferences: string[] = [];
  const undefinedCitations: string[] = [];
  let overfullBoxes = 0;
  let underfullBoxes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Errors start with "! " and the real line number follows on an "l.<n>" line.
    const err = /^!\s+(.*)$/.exec(line);
    if (err) {
      let lineNo: number | undefined;
      for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
        const m = /^l\.(\d+)/.exec(lines[j]!);
        if (m) {
          lineNo = Number(m[1]);
          break;
        }
      }
      errors.push({ message: err[1]!.trim(), ...(lineNo ? { line: lineNo } : {}) });
      continue;
    }

    const warn = /(?:LaTeX|Package\s+\S+|Class\s+\S+)\s+Warning:\s+(.*)$/.exec(line);
    if (warn) {
      const msg = warn[1]!.trim();
      warnings.push(msg);
      const ref = /Reference\s+`([^']+)'.*undefined/.exec(msg);
      if (ref) undefinedReferences.push(ref[1]!);
      const cite = /Citation\s+`([^']+)'.*undefined/.exec(msg);
      if (cite) undefinedCitations.push(cite[1]!);
      continue;
    }

    if (/^Overfull\s+\\[hv]box/.test(line)) overfullBoxes++;
    else if (/^Underfull\s+\\[hv]box/.test(line)) underfullBoxes++;
  }

  return {
    errors,
    warnings,
    undefinedReferences,
    undefinedCitations,
    overfullBoxes,
    underfullBoxes,
  };
}
