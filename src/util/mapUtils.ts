/**
 * Gets the top 3 items from a map based on the value.
 * @param map A map with number values.
 * @returns A map consisting of only the top 3 items from the given map.
 */
export const getTopThreeFromMap = <T>(
  map: Map<T, number>
): Map<T, number> => {
  // Sort map entries and get top 3 based on count from the value
  const sortedEntries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return new Map<T, number>(sortedEntries.slice(0, 3));
};

/**
 * Prints the entries from the given map to the console in the following format:
 * 1. key (value)
 * 2. key (value)
 * 3. key (value)
 * @param map A map with number values.
 * @param hasIndentation Gives the rankings a 2 space indentation.
 */
export const printMapRanking = <T>(
  map: Map<T, number>,
  hasIndentation: boolean = false
) => {
  // Convert to array to use forEach
  const entriesArray = [...map.entries()];
  entriesArray.forEach(([key, value], index) => {
    console.log(`${hasIndentation ? "  " : ""}${index + 1}. ${key} (${value})`);
  });
};
