export class UrlHelper {
  static convertToQueryString(query: { [key: string]: string | number | unknown }) {
    return convertToQueryString(query);
  }
}

export function convertToQueryString(query: { [key: string]: string | number | unknown }) {
  const keys = Object.keys(query);
  const keysLength = keys.length;
  let result = '';

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    result += `&${key}=${JSON.stringify(query[key])}`;
  }

  return result;
}
