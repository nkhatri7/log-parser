import { getFileReader } from "./util/fileUtils";
import { getTopThreeFromMap, printMapRanking } from "./util/mapUtils";

export interface LogResults {
  uniqueIpAddresses: number;
  mostActiveIpAddresses: Map<string, number>;
  mostVisitedUrls: Map<string, number>;
}

export const analyseLogFile = (filePath: string) => {
  const ipAddressMap = new Map<string, number>();
  const urlMap = new Map<string, number>();

  const fileReader = getFileReader(filePath);
  console.log("\nAnalysing file...\n\n");
  fileReader.on("line", line => parseLog(line, ipAddressMap, urlMap));
  fileReader.on("close", () => {
    const logResults = analyseResults(ipAddressMap, urlMap);
    printResults(logResults);
  });
};

export const parseLog = (
  log: string,
  ipAddressMap: Map<string, number>,
  urlMap: Map<string, number>
): void => {
  const ipAddress = extractIpAddressFromLog(log);
  if (ipAddress) {
    // Increment count of IP address in map
    ipAddressMap.set(ipAddress, (ipAddressMap.get(ipAddress) || 0) + 1);
  }

  const url = extractUrlFromLog(log);
  if (url) {
    // Increment count of URL in map
    urlMap.set(url, (urlMap.get(url) || 0) + 1);
  }
};

export const extractIpAddressFromLog = (log: string): string | undefined => {
  // Assume all IP addresses are in IPv4 format
  // 4 sets of numbers between 0-255 separated by a period
  const ipv4OctetPattern = "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  const ipv4Pattern = new RegExp(`\\b${ipv4OctetPattern}(\\.${ipv4OctetPattern}){3}\\b`);
  const regexResult = log.match(ipv4Pattern);
  if (regexResult) {
    return regexResult[0];
  }
};

export const extractUrlFromLog = (log: string): string | undefined => {
  // Target area is structured like "GET /url HTTP/1.1"
  // Most logs will have GET as the request method but include all options
  // just in case
  const HTTP_METHODS = "GET|POST|PUT|DELETE|PATCH|HEAD|CONNECT|OPTIONS|TRACE";
  const requestPattern = new RegExp(`(\\b${HTTP_METHODS}\\b)(.*?)(\\bHTTP\\b)`);
  const regexResult = log.match(requestPattern);
  if (regexResult) {
    // URL will be the second item from the regex extract
    return regexResult[2].trim();
  }
};

export const analyseResults = (
  ipAddressMap: Map<string, number>,
  urlMap: Map<string, number>
): LogResults => {
  const uniqueIpAddresses = ipAddressMap.size;
  const topThreeIpAddress = getTopThreeFromMap(ipAddressMap);
  const topThreeUrls = getTopThreeFromMap(urlMap);

  return {
    uniqueIpAddresses,
    mostActiveIpAddresses: topThreeIpAddress,
    mostVisitedUrls: topThreeUrls,
  };
};

export const printResults = (logResults: LogResults) => {
  console.log("RESULTS");
  console.log("-------");
  console.log(`Number of unique IP addresses: ${logResults.uniqueIpAddresses}`);
  console.log("\nTop 3 most visited URLs:");
  printMapRanking(logResults.mostVisitedUrls, true);
  console.log("\nTop 3 most active IP addresses:");
  printMapRanking(logResults.mostActiveIpAddresses, true);
};
