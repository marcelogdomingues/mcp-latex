import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLog } from '../src/lib/log.js';
import { checkDocument, stripComments } from '../src/lib/document.js';

test('parseLog extracts errors with line numbers', () => {
  const log = [
    'This is pdfTeX...',
    '! Undefined control sequence.',
    'l.42 \\foo',
    '        bar',
    'Overfull \\hbox (10.0pt too wide) in paragraph',
    'LaTeX Warning: Reference `fig:x' + "'" + ' on page 1 undefined on input line 5.',
    'LaTeX Warning: Citation `smith2020' + "'" + ' undefined on input line 7.',
  ].join('\n');

  const parsed = parseLog(log);
  assert.equal(parsed.errors.length, 1);
  assert.equal(parsed.errors[0]!.message, 'Undefined control sequence.');
  assert.equal(parsed.errors[0]!.line, 42);
  assert.equal(parsed.overfullBoxes, 1);
  assert.deepEqual(parsed.undefinedReferences, ['fig:x']);
  assert.deepEqual(parsed.undefinedCitations, ['smith2020']);
});

test('stripComments removes comments but keeps escaped percent', () => {
  assert.equal(stripComments('a % comment'), 'a ');
  assert.equal(stripComments('50\\% off'), '50\\% off');
});

test('checkDocument collects labels, refs and citations', () => {
  const src = String.raw`
\section{Intro}\label{sec:intro}
See \ref{sec:intro} and \cite{a,b}.
`;
  const info = checkDocument(src);
  assert.deepEqual(info.labels, ['sec:intro']);
  assert.deepEqual(info.references, ['sec:intro']);
  assert.deepEqual(info.citations.sort(), ['a', 'b']);
  assert.equal(info.issues.length, 0);
});

test('checkDocument flags undefined reference', () => {
  const info = checkDocument(String.raw`See \ref{missing}.`);
  const kinds = info.issues.map((i) => i.kind);
  assert.ok(kinds.includes('undefinedReference'));
});

test('checkDocument flags duplicate and unused labels', () => {
  const info = checkDocument(String.raw`\label{x}\label{x}`);
  const kinds = info.issues.map((i) => i.kind);
  assert.ok(kinds.includes('duplicateLabel'));
  assert.ok(kinds.includes('unusedLabel'));
});

test('checkDocument detects unbalanced environments', () => {
  const info = checkDocument(String.raw`\begin{itemize}\item a`);
  assert.ok(info.issues.some((i) => i.kind === 'unclosedEnvironment' && i.name === 'itemize'));

  const mism = checkDocument(String.raw`\begin{itemize}\end{enumerate}`);
  assert.ok(mism.issues.some((i) => i.kind === 'mismatchedEnvironment'));
});

test('checkDocument ignores commented-out code', () => {
  const info = checkDocument(String.raw`% \ref{ghost}` + '\n' + String.raw`\label{real}\ref{real}`);
  assert.equal(info.issues.length, 0);
});
