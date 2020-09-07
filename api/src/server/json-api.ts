import { RequestHandler } from 'express';

export interface Resource<TAttributes> {
  id: string;
  type: string;
  attributes: TAttributes;
}

export function jsonApi(): RequestHandler {
  return function(req, res, next) {
    res.header('Content-Type', 'application/vnd.api+json');
    next();
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resource<TAttributes extends Record<string, any>>(
  id: string,
  type: string,
  attributes: TAttributes
) {
  return {
    id,
    type,
    ...(attributes && { attributes }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapResourceResponse<TAttributes extends Record<string, any>>(
  data: Resource<TAttributes> | Resource<TAttributes>[]
) {
  return { data };
}
