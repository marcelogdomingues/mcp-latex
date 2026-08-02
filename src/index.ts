#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { parseLog } from './lib/log.js';
import { checkDocument } from './lib/document.js';
import { compile } from './lib/compile.js';

const server = new McpServer({ name: 'mcp-latex', version: '0.1.0' });

const text = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

server.registerTool(
  'check_document',
  {
    title: 'Check LaTeX document',
    description:
      'Static analysis of LaTeX source: finds undefined references, duplicate/unused labels, and unbalanced environments. Lists labels, references and citations. Works without a TeX install.',
    inputSchema: {
      source: z.string().optional().describe('LaTeX source to analyze'),
      path: z.string().optional().describe('Path to a .tex file (used if source is omitted)'),
    },
  },
  async ({ source, path }) => {
    const src = source ?? (path ? readFileSync(path, 'utf8') : '');
    if (!src) throw new Error('Provide either "source" or "path".');
    return text(checkDocument(src));
  },
);

server.registerTool(
  'parse_log',
  {
    title: 'Parse LaTeX log',
    description:
      'Parses a LaTeX .log file into structured errors, warnings, undefined references/citations, and over/underfull box counts.',
    inputSchema: {
      logContent: z.string().optional().describe('Contents of a .log file'),
      path: z.string().optional().describe('Path to a .log file (used if logContent is omitted)'),
    },
  },
  async ({ logContent, path }) => {
    const content = logContent ?? (path ? readFileSync(path, 'utf8') : '');
    if (!content) throw new Error('Provide either "logContent" or "path".');
    return text(parseLog(content));
  },
);

server.registerTool(
  'compile',
  {
    title: 'Compile LaTeX',
    description:
      'Compiles a .tex file with latexmk/pdflatex if a TeX engine is installed, and returns parsed errors. Returns available:false with guidance if no engine is found.',
    inputSchema: {
      path: z.string().describe('Path to the .tex file to compile'),
      engine: z.enum(['latexmk', 'pdflatex']).optional().describe('Preferred engine (default latexmk)'),
    },
  },
  async ({ path, engine }) => text(compile(path, engine ?? 'latexmk')),
);

async function main() {
  await server.connect(new StdioServerTransport());
  console.error('mcp-latex ready (stdio)');
}

main().catch((err) => {
  console.error('Fatal error starting mcp-latex:', err);
  process.exit(1);
});
