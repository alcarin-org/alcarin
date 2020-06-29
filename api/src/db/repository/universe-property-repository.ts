import { Repository, EntityRepository, In } from 'typeorm';

import { UniverseProperty } from '../entities';

@EntityRepository(UniverseProperty)
export class UniversePropertyRepository extends Repository<UniverseProperty> {
  async get(key: string) {
    const entity = await this.manager.findOne(UniverseProperty, { key });
    return entity && entity.value;
  }

  async getMany(keys: string[]) {
    const entities = await this.manager.find(UniverseProperty, {
      where: {
        key: In(keys),
      },
    });
    const sortedProperties = entities.sort(
      (a, b) => keys.indexOf(a.key) - keys.indexOf(b.key)
    );

    return sortedProperties.map(entity => entity.value);
  }

  async set(key: string, value: string) {
    const entry = this.manager.create(UniverseProperty, {
      key,
      value,
    });

    return this.manager.save(entry);
  }

  async setMany(properties: { key: string; value: string }[]) {
    const entries = properties.map(({ key, value }) =>
      this.manager.create(UniverseProperty, {
        key,
        value,
      })
    );

    return this.manager.save(entries);
  }
}
