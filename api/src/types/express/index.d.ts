import * as core from 'express-serve-static-core';

import { User } from '../../db/entities/user';

declare type ObjectType<T> = { new (): T } | Function;
declare interface EntityMap {
  set<Entity>(type: ObjectType<Entity>, value: Entity): void;
  get<Entity>(type: ObjectType<Entity>): Entity;
}

export type DeNeverify<Type, Key extends keyof Type> = Type[Key] extends never
  ? {}
  : { [key in Key]: Type[Key] };

declare module 'express-serve-static-core' {
  export interface Request<P extends core.Params = core.ParamsDictionary> {
    user: User;
    preloaded: EntityMap;
  }
}

declare module 'express' {
  export type AppRequest<Config extends AppRequestConfig = {}> = Omit<
    core.Request,
    'body' | 'params' | 'query'
  > &
    DeNeverify<Config, 'body'> &
    DeNeverify<Config, 'query'> &
    DeNeverify<Config, 'params'> & {
      user: User;
      preloaded: EntityMap;
    };

  export type AppRequestConfig<B = {}, Q = {}, P = {}, H = {}> = {
    body?: B;
    query?: Q;
    params?: P;
    headers?: H;
  };

  export interface AppRequestHandler<
    Config extends AppRequestConfig = {},
    Response = {}
  > {
    (req: AppRequest<Config>, res: core.Response, next: core.NextFunction):
      | Promise<Response>
      | Promise<void>;
  }
}
