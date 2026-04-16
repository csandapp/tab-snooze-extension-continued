import { describe, it, expect } from 'vitest';
import { groupTabs } from '../components/CleanupPanel/groupTabs';

const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

const tabs = [
  { id: 1, url: 'https://github.com/issues', lastAccessed: NOW - 1000 },
  { id: 2, url: 'https://github.com/pulls', lastAccessed: NOW - 8 * DAY_MS },
  { id: 3, url: 'https://news.ycombinator.com/', lastAccessed: NOW - 3 * DAY_MS },
];

describe('groupTabs — flat', () => {
  it('returns a single group with an empty header containing all tabs', () => {
    const groups = groupTabs(tabs, 'flat');
    expect(groups).toHaveLength(1);
    expect(groups[0].header).toBe('');
    expect(groups[0].tabs).toHaveLength(3);
  });
});

describe('groupTabs — domain', () => {
  it('groups tabs by URL hostname', () => {
    const groups = groupTabs(tabs, 'domain');
    const headers = groups.map(g => g.header).sort();
    expect(headers).toEqual(['github.com', 'news.ycombinator.com'].sort());
  });

  it('puts both github tabs into the same group', () => {
    const groups = groupTabs(tabs, 'domain');
    const ghGroup = groups.find(g => g.header === 'github.com');
    expect(ghGroup?.tabs).toHaveLength(2);
  });
});

describe('groupTabs — age', () => {
  it('assigns tabs to the correct age buckets', () => {
    const groups = groupTabs(tabs, 'age');
    const today = groups.find(g => g.header === 'Opened today');
    const thisWeek = groups.find(g => g.header === 'Opened this week');
    const older = groups.find(g => g.header === 'Older');
    expect(today?.tabs.map(t => t.id)).toContain(1);
    expect(thisWeek?.tabs.map(t => t.id)).toContain(3);
    expect(older?.tabs.map(t => t.id)).toContain(2);
  });

  it('omits age buckets with no tabs', () => {
    const todayOnly = [{ id: 1, url: 'https://a.com', lastAccessed: NOW - 1000 }];
    const groups = groupTabs(todayOnly, 'age');
    expect(groups.every(g => g.tabs.length > 0)).toBe(true);
    expect(groups.some(g => g.header === 'Opened today')).toBe(true);
    expect(groups.some(g => g.header === 'Older')).toBe(false);
  });
});
