import { EntityManager, EntityRepository, In } from 'typeorm';

import { UniverseProperty } from '../entities/universe-property';

@EntityRepository()
export class UniversePropertyRepository {
  constructor(private manager: EntityManager) {}

  async get(key: string) {
    return this.manager.findOne(UniverseProperty, { key });
  }

  async getMany(keys: string[]) {
    return this.manager.find(UniverseProperty, {
      where: {
        key: In(keys),
      },
    });
  }

  async set(key: string, value: string) {
    const entry = this.manager.create(UniverseProperty, {
      key,
      value,
    });

    return this.manager.save(entry);
  }

  async setAll(properties: { key: string; value: string }[]) {
    const entries = properties.map(({ key, value }) =>
      this.manager.create(UniverseProperty, {
        key,
        value,
      })
    );

    return this.manager.save(entries);
  }
}
