import boom from '@hapi/boom';
import { RequestHandler } from 'express';
import async from 'express-async-handler';
import { EntityManager, ObjectType } from 'typeorm';

import { getDefaultConnection } from '../../server/db';
import { isProduction } from '../../server/core/env-vars';

const errorMessage = isProduction()
  ? () => ''
  : (paramsValues: object) =>
      `Entity with id ${JSON.stringify(paramsValues)} does not exist.`;

export function preloadEntity<Entity>(
  repoClass: RepositoryClass<Entity>,
  paramName: string | string[]
): RequestHandler {
  return async(async function preloadEntityMiddleware(req, res, next) {
    const defaultConnection = getDefaultConnection();
    if (!defaultConnection) {
      throw new Error('Default connection not ready yet');
    }

    const paramNames = Array.isArray(paramName) ? paramName : [paramName];
    const paramsValues = paramNames.map(name => req.params[name]);

    const repo = defaultConnection.manager.getCustomRepository(repoClass);
    if (repo.get.length !== paramNames.length) {
      throw new Error(
        `Implementation error, repository '${repoClass.name}' "get" function ` +
          `expect '${repo.get.length}' args, but '${paramNames.length}' provided ` +
          'to the preload middleware.'
      );
    }

    const entity = await repo.get(...paramsValues);
    if (!entity) {
      const errMsg = errorMessage(paramsValues);
      throw boom.notFound(errMsg);
    }

    const ctor = getEntityClassConstructor(entity);
    req.preloaded.set(ctor, entity);
    next();
  });
}

export class EntityMap {
  private map = new Map();

  set<Entity>(type: ObjectType<Entity>, value: Entity) {
    this.map.set(type, value);
  }
  get<Entity>(type: ObjectType<Entity>): Entity {
    const entity = this.map.get(type);
    if (!entity) {
      throw new Error(
        `Implementation error: Entity "${type.name}" has not been preloaded.`
      );
    }

    return entity;
  }
}

export interface PreloadableRepo<Entity> {
  get(...args: string[]): Promise<Entity | undefined>;
}

type RepositoryClass<Entity> = {
  new (manager: EntityManager): PreloadableRepo<Entity>;
};

export function preloadEntityStorage(): RequestHandler {
  return function(req, res, next) {
    req.preloaded = new EntityMap();
    next();
  };
}

function getEntityClassConstructor<Entity>(entity: Entity) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (entity as any).constructor;
}
