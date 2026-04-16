// @flow

export type GroupBy = 'flat' | 'domain' | 'age';
export type TabGroup = {| header: string, tabs: Array<Object> |};

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export function groupTabs(tabs: Array<Object>, groupBy: GroupBy): Array<TabGroup> {
  if (groupBy === 'flat') {
    return [{ header: '', tabs }];
  }

  if (groupBy === 'domain') {
    const map: Map<string, Array<Object>> = new Map();
    for (const tab of tabs) {
      let domain = '';
      try { domain = new URL(tab.url || '').hostname; } catch {}
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)?.push(tab);
    }
    return Array.from(map.entries()).map(([header, tabs]) => ({ header, tabs }));
  }

  // age
  const now = Date.now();
  const buckets: { [string]: Array<Object> } = {
    'Opened today': [],
    'Opened this week': [],
    'Older': [],
  };
  for (const tab of tabs) {
    const age = now - (tab.lastAccessed || 0);
    if (age < DAY_MS) buckets['Opened today'].push(tab);
    else if (age < WEEK_MS) buckets['Opened this week'].push(tab);
    else buckets['Older'].push(tab);
  }
  return Object.entries(buckets)
    .filter(([, t]) => t.length > 0)
    .map(([header, tabs]) => ({ header, tabs }));
}
