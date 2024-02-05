import {
  LogResults,
  analyseLogFile,
  analyseResults,
  extractIpAddressFromLog,
  extractUrlFromLog,
  parseLog,
  printResults
} from "./logParser";
import {
  createMockLogWithIpAddress,
  createMockLogWithRequest
} from "./util/testUtils";
import * as fileUtils from "./util/fileUtils";
import * as mapUtils from "./util/mapUtils";

const EXAMPLE_LOG_FILE_PATH = "./assets/mockData/programming-task-example-data.log";

describe("analyseLogFile", () => {
  jest.mock("./util/fileUtils");
  jest.mock("./util/mapUtils");
  jest.mock("readline");
  jest.mock("fs");

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should create file reader", () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    const getFileReaderMock = jest.spyOn(fileUtils, "getFileReader");

    const mockInterface = {
      on: jest.fn(),
      close: jest.fn(),
    };

    (fileUtils.getFileReader as jest.Mock).mockReturnValue({
      on: mockInterface.on,
      close: mockInterface.close
    });

    analyseLogFile(EXAMPLE_LOG_FILE_PATH);

    expect(getFileReaderMock).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
  });

  it("should try to parse the log on each line", () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(fileUtils, "getFileReader");

    const mockInterface = {
      on: jest.fn(),
      close: jest.fn(),
    };

    (fileUtils.getFileReader as jest.Mock).mockReturnValue({
      on: mockInterface.on,
      close: mockInterface.close
    });

    analyseLogFile(EXAMPLE_LOG_FILE_PATH);

    expect(mockInterface.on).toHaveBeenCalledWith("line", expect.any(Function));

    jest.restoreAllMocks();
  });

  it("should analyse and print the results when done reading the file", () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(fileUtils, "getFileReader");

    const mockInterface = {
      on: jest.fn(),
      close: jest.fn(),
    };

    (fileUtils.getFileReader as jest.Mock).mockReturnValue({
      on: mockInterface.on,
      close: mockInterface.close
    });

    analyseLogFile(EXAMPLE_LOG_FILE_PATH);

    expect(mockInterface.on).toHaveBeenCalledWith("close", expect.any(Function));

    jest.restoreAllMocks();
  });
});

describe("parseLog", () => {
  it("should initialise IP address count with 1 for new IP address found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const ipAddress = "1.1.1.1";
    const log = createMockLogWithIpAddress(ipAddress);

    parseLog(log, ipAddressMap, urlMap);

    expect(ipAddressMap.get(ipAddress)).toBe(1);
  });

  it("should initialise URL count with 1 for new URL found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const url = "/intranet-analytics";
    const log = createMockLogWithRequest("GET", url);

    parseLog(log, ipAddressMap, urlMap);

    expect(urlMap.get(url)).toBe(1);
  });

  it("should increment IP address count when existing IP address is found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const ipAddress = "1.1.1.1";
    ipAddressMap.set(ipAddress, 1);
    const log = createMockLogWithIpAddress(ipAddress);

    parseLog(log, ipAddressMap, urlMap);

    expect(ipAddressMap.get(ipAddress)).toBe(2);
  });

  it("should increment URL count with existing URL is found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const url = "/intranet-analytics";
    urlMap.set(url, 1);
    const log = createMockLogWithRequest("GET", url);

    parseLog(log, ipAddressMap, urlMap);

    expect(urlMap.get(url)).toBe(2);
  });

  it("should not update IP address map if IP address is not found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const invalidIpAddress = "1111.1.1.1";
    const log = createMockLogWithIpAddress(invalidIpAddress);

    parseLog(log, ipAddressMap, urlMap);

    expect(ipAddressMap.get(invalidIpAddress)).toBeUndefined();
    expect(ipAddressMap.size).toBe(0);
  });

  it("should not update URL map if URL is not found in log", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    const invalidUrl = "not a url url";
    const log = createMockLogWithRequest("not a request method", invalidUrl);

    parseLog(log, ipAddressMap, urlMap);

    expect(urlMap.get(invalidUrl)).toBeUndefined();
    expect(urlMap.size).toBe(0);
  });
});

describe("extractIpAdressFromLog", () => {
  it("should extract IP address in the format of 1.1.1.1", () => {
    const ipAddress = "1.1.1.1";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 11.1.1.1", () => {
    const ipAddress = "11.1.1.1";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 11.11.1.1", () => {
    const ipAddress = "11.11.1.1";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 11.11.11.1", () => {
    const ipAddress = "11.11.11.1";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 11.11.11.11", () => {
    const ipAddress = "11.11.11.11";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 111.11.11.11", () => {
    const ipAddress = "111.11.11.11";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 111.111.11.11", () => {
    const ipAddress = "111.111.11.11";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 111.111.111.11", () => {
    const ipAddress = "111.111.111.11";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should extract IP address in the format of 111.111.111.111", () => {
    const ipAddress = "111.111.111.111";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBe(ipAddress);
  });

  it("should not extract IP address in the format of 1111.111.111.111", () => {
    const ipAddress = "1111.111.111.111";
    const log = createMockLogWithIpAddress(ipAddress);
    const result = extractIpAddressFromLog(log);
    expect(result).toBeUndefined();
  });
});

describe("extractUrlFromLog", () => {
  it("should extract URL with GET request and internal url", () => {
    const url = "/intranet-analytics";
    const log = createMockLogWithRequest("GET", url);
    const result = extractUrlFromLog(log);
    expect(result).toEqual(url);
  });

  it("should extract URL with POST request and internal url", () => {
    const url = "/intranet-analytics";
    const log = createMockLogWithRequest("POST", url);
    const result = extractUrlFromLog(log);
    expect(result).toEqual(url);
  });

  it("should extract URL with GET request and external url", () => {
    const url = "http://example.net/faq/";
    const log = createMockLogWithRequest("GET", url);
    const result = extractUrlFromLog(log);
    expect(result).toEqual(url);
  });
});

describe("analyseResults", () => {
  it("should count the number of unique IP addresses", () => {
    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    ipAddressMap.set("1.1.1.1", 3);
    ipAddressMap.set("1.2.1.2", 2);
    ipAddressMap.set("1.3.1.3", 1);
    ipAddressMap.set("111.111.111.111", 5);

    const results = analyseResults(ipAddressMap, urlMap);
    expect(results.uniqueIpAddresses).toBe(4);
  });

  it("should get the top 3 IP addresses", () => {
    const getTopThreeFromMapMock = jest.spyOn(mapUtils, "getTopThreeFromMap");

    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    analyseResults(ipAddressMap, urlMap);
    expect(getTopThreeFromMapMock).toHaveBeenCalledWith(ipAddressMap);

    getTopThreeFromMapMock.mockRestore();
  });

  it("should get the 3 most visited URLs", () => {
    const getTopThreeFromMapMock = jest.spyOn(mapUtils, "getTopThreeFromMap");

    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    analyseResults(ipAddressMap, urlMap);
    expect(getTopThreeFromMapMock).toHaveBeenCalledWith(urlMap);

    getTopThreeFromMapMock.mockRestore();
  });
});

describe("printResults", () => {
  it("should log the number of unique IP addresses", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(mapUtils, "printMapRanking");

    const mockResults: LogResults = {
      uniqueIpAddresses: 3,
      mostVisitedUrls: new Map<string, number>(),
      mostActiveIpAddresses: new Map<string, number>(),
    };

    printResults(mockResults);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Number of unique IP addresses: 3")
    );

    jest.restoreAllMocks();
  });

  it("should log the most visited URLs", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const printMapRankingMock = jest.spyOn(mapUtils, "printMapRanking");

    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    const mockResults: LogResults = {
      uniqueIpAddresses: 3,
      mostVisitedUrls: urlMap,
      mostActiveIpAddresses: ipAddressMap,
    };

    printResults(mockResults);

    expect(printMapRankingMock).toHaveBeenCalledWith(urlMap, true);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("most visited URLs")
    );

    jest.restoreAllMocks();
  });

  it("should log the most active IP addresses", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const printMapRankingMock = jest.spyOn(mapUtils, "printMapRanking");

    const ipAddressMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    const mockResults: LogResults = {
      uniqueIpAddresses: 3,
      mostVisitedUrls: urlMap,
      mostActiveIpAddresses: ipAddressMap,
    };

    printResults(mockResults);

    expect(printMapRankingMock).toHaveBeenCalledWith(ipAddressMap, true);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("most active IP addresses")
    );

    jest.restoreAllMocks();
  });
});
