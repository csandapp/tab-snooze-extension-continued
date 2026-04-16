// @flow

function getDedupeKey(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname}${u.hash}`;
  } catch {
    return url;
  }
}

export function findDuplicates(tabs: Array<Object>): {| keep: Array<Object>, close: Array<Object> |} {
  const groups: Map<string, Array<Object>> = new Map();
  for (const tab of tabs) {
    const key = getDedupeKey(tab.url || '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(tab);
  }

  const keep = [];
  const close = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      keep.push(group[0]);
    } else {
      const sorted = [...group].sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
      keep.push(sorted[0]);
      close.push(...sorted.slice(1));
    }
  }
  return { keep, close };
}

export function filterAutoCloseDomains(
  tabs: Array<Object>,
  domains: Array<string>
): {| keep: Array<Object>, close: Array<Object> |} {
  if (domains.length === 0) return { keep: tabs, close: [] };
  const keep = [];
  const close = [];
  for (const tab of tabs) {
    try {
      const hostname = new URL(tab.url || '').hostname;
      if (domains.includes(hostname)) {
        close.push(tab);
      } else {
        keep.push(tab);
      }
    } catch {
      keep.push(tab);
    }
  }
  return { keep, close };
}

export async function runAutoProcess(
  tabs: Array<Object>,
  autoCloseDomains: Array<string>
): Promise<{| remaining: Array<Object>, closed: Array<Object> |}> {
  const { keep: dedupedTabs, close: dupes } = findDuplicates(tabs);
  const { keep: remaining, close: domainClosed } = filterAutoCloseDomains(dedupedTabs, autoCloseDomains);
  return { remaining, closed: [...dupes, ...domainClosed] };
}
