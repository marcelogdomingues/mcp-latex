import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { parseLog, type ParsedLog } from './log.js';

export interface CompileResult {
  ok: boolean;
  engine: string;
  available: boolean;
  message: string;
  log?: ParsedLog;
}

function has(cmd: string): boolean {
  return spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], {
    stdio: 'ignore',
  }).status === 0;
}

/**
 * Compiles a `.tex` file by shelling out to `latexmk` (preferred) or `pdflatex`.
 * If no TeX engine is installed, returns `available: false` with guidance rather
 * than throwing — the parsing/checking tools still work without a TeX install.
 */
export function compile(texPath: string, engine: 'latexmk' | 'pdflatex' = 'latexmk'): CompileResult {
  if (!existsSync(texPath)) {
    return { ok: false, engine, available: true, message: `File not found: ${texPath}` };
  }

  const tool = has('latexmk') && engine === 'latexmk' ? 'latexmk' : has('pdflatex') ? 'pdflatex' : null;
  if (!tool) {
    return {
      ok: false,
      engine,
      available: false,
      message:
        'No TeX engine found (latexmk/pdflatex). Install TeX Live or MacTeX to compile. ' +
        'The parse_log and check_document tools work without it.',
    };
  }

  const dir = dirname(texPath);
  const file = basename(texPath);
  const args =
    tool === 'latexmk'
      ? ['-pdf', '-interaction=nonstopmode', '-halt-on-error', file]
      : ['-interaction=nonstopmode', '-halt-on-error', file];

  const run = spawnSync(tool, args, { cwd: dir, encoding: 'utf8', timeout: 120_000 });

  const logPath = join(dir, basename(file, extname(file)) + '.log');
  let log: ParsedLog | undefined;
  if (existsSync(logPath)) {
    log = parseLog(readFileSync(logPath, 'utf8'));
  }

  const ok = run.status === 0 && (!log || log.errors.length === 0);
  return {
    ok,
    engine: tool,
    available: true,
    message: ok ? 'Compiled successfully' : 'Compilation reported errors',
    ...(log ? { log } : {}),
  };
}
