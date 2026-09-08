export function compareServersByMapOrder<
  T extends { mapDisplayName: string; name: string },
>(a: T, b: T, mapOrder: string[]): number {
  const indexA = mapOrder.findIndex(
    (entry) => entry.toLowerCase() === a.mapDisplayName.toLowerCase(),
  );
  const indexB = mapOrder.findIndex(
    (entry) => entry.toLowerCase() === b.mapDisplayName.toLowerCase(),
  );

  const rankA = indexA === -1 ? Number.POSITIVE_INFINITY : indexA;
  const rankB = indexB === -1 ? Number.POSITIVE_INFINITY : indexB;

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  const mapCompare = a.mapDisplayName.localeCompare(b.mapDisplayName, undefined, {
    sensitivity: 'base',
  });
  if (mapCompare !== 0) {
    return mapCompare;
  }

  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}
