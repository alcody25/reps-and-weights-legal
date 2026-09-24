import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pages = ['index.html', 'privacy/index.html'];
const pageSources = pages.map((path) => ({ path, source: readFileSync(path, 'utf8') }));
const stylesheet = readFileSync('styles.css', 'utf8');

test('contains no executable, embedded, form, cookie, or browser-storage behavior', () => {
  for (const { path, source } of pageSources) {
    assert.doesNotMatch(source, /<(?:script|iframe|object|embed|form)\b/i, `${path} contains active or embedded content`);
    assert.doesNotMatch(source, /\b(?:document\.cookie|localStorage|sessionStorage)\b/i, `${path} contains client storage`);
    assert.doesNotMatch(source, /<meta[^>]+http-equiv=["']refresh["']/i, `${path} contains a redirect`);
  }
});

test('loads only local resources', () => {
  for (const { path, source } of pageSources) {
    for (const match of source.matchAll(/<(?:link|img|source|video|audio)\b[^>]+(?:href|src)=["']([^"']+)["']/gi)) {
      assert.match(match[1], /^\.\.?(?:\/|$)/, `${path} automatically loads non-local resource ${match[1]}`);
    }
  }

  assert.doesNotMatch(stylesheet, /@import\b/i);
  assert.doesNotMatch(stylesheet, /url\(\s*["']?(?:https?:)?\/\//i);
});

test('limits external links to reviewed GitHub destinations', () => {
  const allowedExternalLinks = new Set([
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
    'https://github.com/alcody25/reps-and-weights-legal/issues',
  ]);

  for (const { path, source } of pageSources) {
    const externalLinks = [...source.matchAll(/<a\b[^>]+href=["'](https?:\/\/[^"']+)["']/gi)]
      .map((match) => match[1]);
    assert.deepEqual(externalLinks.filter((link) => !allowedExternalLinks.has(link)), [], `${path} has an unreviewed external link`);
  }
});

test('retains material no-tracking and local-first disclosures', () => {
  const policy = readFileSync('privacy/index.html', 'utf8');

  assert.match(policy, /does not\s+create accounts or send your workout records/i);
  assert.match(policy, /does not include third-party analytics or crash-reporting SDKs/i);
  assert.match(policy, /readable,\s+unencrypted file/i);
  assert.match(policy, /private application storage/i);
  assert.match(policy, /do not add analytics, advertising, or tracking scripts/i);
});
