import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function withClient(fn: (c: Client) => Promise<void>) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['--import', 'tsx', 'src/index.ts'],
  });
  const client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(transport);
  try {
    await fn(client);
  } finally {
    await client.close();
  }
}

function firstText(result: { content: Array<{ type: string; text?: string }> }) {
  return JSON.parse(result.content.find((c) => c.type === 'text')!.text!);
}

test('lists the expected tools', async () => {
  await withClient(async (client) => {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name).sort(), ['check_document', 'compile', 'parse_log']);
  });
});

test('check_document tool reports an undefined reference', async () => {
  await withClient(async (client) => {
    const res = await client.callTool({
      name: 'check_document',
      arguments: { source: 'See \\ref{missing}.' },
    });
    const parsed = firstText(res as never);
    assert.ok(parsed.issues.some((i: { kind: string }) => i.kind === 'undefinedReference'));
  });
});

test('compile reports gracefully when no engine is installed', async () => {
  await withClient(async (client) => {
    const res = await client.callTool({
      name: 'compile',
      arguments: { path: '/nonexistent/does-not-exist.tex' },
    });
    const parsed = firstText(res as never);
    // Either the file-not-found path or the no-engine path — both are non-throwing.
    assert.equal(typeof parsed.ok, 'boolean');
    assert.equal(typeof parsed.message, 'string');
  });
});
