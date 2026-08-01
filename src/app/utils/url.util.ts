export function createQueryString(query: Record<string, unknown>) {
  const keys = Object.keys(query);
  const keysLength = keys.length;
  const result: string[] = [];

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    result.push(`${key}=${query[key]}`);
  }

  return result.join('&');
}

export function createHeaders(keyValue: Record<string, unknown>) {
  const headers = new Headers();
  const requestHeaders = Object.keys(keyValue);
  const requestHeadersLength = requestHeaders.length;

  for (let i = 0; i < requestHeadersLength; i++) {
    const header = requestHeaders[i];
    headers.append(header, String(keyValue[header]));
  }

  return headers;
}
