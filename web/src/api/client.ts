// .env is not supported in types for now, check it with newer version of
// @snowpack/app-scripts-react
const BaseUrl: string = (import.meta as any).env.SNOWPACK_PUBLIC_API_URL;

export function get<TResponseBody>(
  path: string,
  body: {},
  query: Record<string, string> = {}
) {
  return call<TResponseBody>({ method: 'get', path, body, query });
}

export function post<TResponseBody>(
  path: string,
  body: {},
  query: Record<string, string> = {}
) {
  return call<TResponseBody>({ method: 'post', path, body, query });
}

interface CallArgs {
  method: string;
  path: string;
  query: Record<string, string>;
  body?: {};
}

async function call<TResponseBody>({ method, path, query, body }: CallArgs) {
  const url = BaseUrl.replace(/\/$/, '') + path;
  const queryString = new URLSearchParams(query).toString();
  const reqUrl = url + (queryString ? `?${queryString}` : '');
  const req = new Request(reqUrl, {
    method: method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const res = await fetch(req);
  return {
    status: res.status,
    body: res.bodyUsed && ((await res.json()) as TResponseBody),
  };
}
