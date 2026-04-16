import { describe, it, expect } from 'vitest';
import { findDuplicates, filterAutoCloseDomains, runAutoProcess } from '../components/CleanupPanel/autoProcess';

describe('findDuplicates', () => {
  it('keeps all tabs when no duplicates exist', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page', lastAccessed: 1000 },
      { id: 2, url: 'https://b.com/page', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(2);
    expect(close).toHaveLength(0);
  });

  it('treats same URL with different query strings as duplicates', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page?q=1', lastAccessed: 1000 },
      { id: 2, url: 'https://a.com/page?q=2', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(1);
    expect(keep[0].id).toBe(2);
    expect(close[0].id).toBe(1);
  });

  it('keeps the tab with the highest lastAccessed among three duplicates', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page', lastAccessed: 3000 },
      { id: 2, url: 'https://a.com/page', lastAccessed: 1000 },
      { id: 3, url: 'https://a.com/page', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(1);
    expect(keep[0].id).toBe(1);
    expect(close.map(t => t.id).sort()).toEqual([2, 3]);
  });

  it('treats tabs with different URL hashes as distinct (only query string is stripped)', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page#section1', lastAccessed: 1000 },
      { id: 2, url: 'https://a.com/page#section2', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(2);
    expect(close).toHaveLength(0);
  });
});

describe('filterAutoCloseDomains', () => {
  it('closes tabs whose hostname exactly matches a configured domain', () => {
    const tabs = [
      { id: 1, url: 'https://mail.google.com/inbox' },
      { id: 2, url: 'https://github.com/issues' },
    ];
    const { keep, close } = filterAutoCloseDomains(tabs, ['mail.google.com']);
    expect(keep.map(t => t.id)).toEqual([2]);
    expect(close.map(t => t.id)).toEqual([1]);
  });

  it('returns all tabs as keep when domains list is empty', () => {
    const tabs = [{ id: 1, url: 'https://a.com/page' }];
    const { keep, close } = filterAutoCloseDomains(tabs, []);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });

  it('does not close a subdomain when only the parent domain is listed', () => {
    const tabs = [{ id: 1, url: 'https://mail.google.com/inbox' }];
    const { keep, close } = filterAutoCloseDomains(tabs, ['google.com']);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });

  it('keeps tabs with unparseable URLs rather than crashing', () => {
    const tabs = [{ id: 1, url: '' }];
    const { keep, close } = filterAutoCloseDomains(tabs, ['a.com']);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });
});

describe('runAutoProcess', () => {
  it('runs dedup then domain-close in sequence', async () => {
    const tabs = [
      { id: 1, url: 'https://mail.google.com/?q=1', lastAccessed: 2000 },
      { id: 2, url: 'https://mail.google.com/?q=2', lastAccessed: 1000 },
      { id: 3, url: 'https://github.com/issues', lastAccessed: 3000 },
    ];
    // Tab 1 survives dedup (higher lastAccessed) but is then domain-closed
    // Tab 2 closed by dedup
    // Tab 3 survives both
    const { remaining, closed } = await runAutoProcess(tabs, ['mail.google.com']);
    expect(remaining.map(t => t.id)).toEqual([3]);
    expect(closed.map(t => t.id).sort()).toEqual([1, 2]);
  });

  it('returns all tabs as remaining when there are no dupes and no auto-close domains', async () => {
    const tabs = [
      { id: 1, url: 'https://a.com', lastAccessed: 1000 },
      { id: 2, url: 'https://b.com', lastAccessed: 2000 },
    ];
    const { remaining, closed } = await runAutoProcess(tabs, []);
    expect(remaining).toHaveLength(2);
    expect(closed).toHaveLength(0);
  });
});
