import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../core/debugStorage', () => ({}));

import { getTriageHistory, appendTriageEntries } from '../core/storage';

describe('getTriageHistory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns empty array when no history exists', async () => {
    chrome.storage.local.get.mockResolvedValue({});
    expect(await getTriageHistory()).toEqual([]);
  });

  it('returns stored entries', async () => {
    const entries = [{ url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() }];
    chrome.storage.local.get.mockResolvedValue({ triageHistory: entries });
    expect(await getTriageHistory()).toEqual(entries);
  });
});

describe('appendTriageEntries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appends new entries to empty history', async () => {
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [] });
    const entry = { url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() };
    await appendTriageEntries([entry]);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      triageHistory: [entry],
    });
  });

  it('prunes entries older than 24 hours before saving', async () => {
    const stale = { url: 'https://old.com', title: 'Old', favicon: '', closedAt: Date.now() - 25 * 60 * 60 * 1000 };
    const fresh = { url: 'https://fresh.com', title: 'Fresh', favicon: '', closedAt: Date.now() - 1000 };
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [stale, fresh] });

    const newEntry = { url: 'https://new.com', title: 'New', favicon: '', closedAt: Date.now() };
    await appendTriageEntries([newEntry]);

    const [[saved]] = chrome.storage.local.set.mock.calls;
    expect(saved.triageHistory).not.toContainEqual(stale);
    expect(saved.triageHistory).toContainEqual(fresh);
    expect(saved.triageHistory).toContainEqual(newEntry);
  });

  it('appends multiple entries at once', async () => {
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [] });
    const entries = [
      { url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() },
      { url: 'https://b.com', title: 'B', favicon: '', closedAt: Date.now() },
    ];
    await appendTriageEntries(entries);
    const [[saved]] = chrome.storage.local.set.mock.calls;
    expect(saved.triageHistory).toHaveLength(2);
  });
});
