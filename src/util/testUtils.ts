export const createMapWithNItems = (noOfItems: number): Map<string, number> => {
  const map = new Map<string, number>();
  for (let i = 0; i < noOfItems; i++) {
    map.set(`key${i + 1}`, 1);
  }
  return map;
};

export const createMockLog = () => {
  return "177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] \"GET /intranet-analytics/ HTTP/1.1\" 200 3574 \"-\" \"Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7\"";
};

export const createMockLogWithIpAddress = (ipAddress: string): string => {
  return `${ipAddress} - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`;
};

export const createMockLogWithRequest = (
  requestMethod: string,
  url: string
): string => {
  return `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "${requestMethod} ${url} HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`;
};
