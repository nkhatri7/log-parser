import { getTopThreeFromMap, printMapRanking } from "./mapUtils";
import { createMapWithNItems } from "./testUtils";

describe("getTopThreeFromMap", () => {
  it("should return 3 items from the map if there are 3 items in the given map", () => {
    const map = createMapWithNItems(3);
    const result = getTopThreeFromMap(map);
    expect(result.size).toBe(3);
  });

  it("should return 3 items from the map if there are more than 5 items in the given map", () => {
    const map = createMapWithNItems(5);
    const result = getTopThreeFromMap(map);
    expect(result.size).toBe(3);
  });

  it("should return 2 items from the map if there are 2 items in the given map", () => {
    const map = createMapWithNItems(2);
    const result = getTopThreeFromMap(map);
    expect(result.size).toBe(2);
  });

  it("should return an empty map if the given map is empty", () => {
    const map = createMapWithNItems(0);
    const result = getTopThreeFromMap(map);
    expect(result.size).toBe(0);
  });

  it("should return all items in same order if they all have the same value", () => {
    const map = createMapWithNItems(3);
    const result = getTopThreeFromMap(map);
    expect(result).toEqual(map);
  });

  it("should return items in descending order based on value", () => {
    const map = new Map<string, number>([
      ["key1", 2],
      ["key2", 5],
      ["key3", 1],
      ["key4", 7],
    ]);

    const expected = [
      ["key4", 7],
      ["key2", 5],
      ["key1", 2],
    ];

    const result = getTopThreeFromMap(map);
    const resultArray = [...result.entries()];
    expect(resultArray).toEqual(expected);
  });
});

describe("printMapRanking", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log");
    logSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should print map entries without indentation if hasIndentation is not given or false", () => {
    const map = new Map<string, number>([
      ["key4", 7],
      ["key2", 5],
      ["key1", 2],
    ]);

    printMapRanking(map);

    const expectedOutput = [
      "1. key4 (7)",
      "2. key2 (5)",
      "3. key1 (2)",
    ];

    expect(logSpy.mock.calls.flat()).toEqual(expectedOutput);
  });

  it("should print map entries with a 2 space indentation if hasIndentation is true", () => {
    const map = new Map<string, number>([
      ["key4", 7],
      ["key2", 5],
      ["key1", 2],
    ]);

    printMapRanking(map, true);

    const expectedOutput = [
      "  1. key4 (7)",
      "  2. key2 (5)",
      "  3. key1 (2)",
    ];

    expect(logSpy.mock.calls.flat()).toEqual(expectedOutput);
  });
});
