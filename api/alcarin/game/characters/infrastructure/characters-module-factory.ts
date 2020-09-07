import { CharactersService } from '../application/characters.service';
import { RacePluginRegistry } from '../domain/race-plugin-registry';
import { availableRacePlugins } from '../plugins/races';

import { createRepository } from './typeorm/characters-repository';
import { ChronosImp } from './chronos/Chronos';
import { createQuery } from './typeorm/characters-query';

export function CharactersModuleFactory() {
  const racePluginRegistry = new RacePluginRegistry();
  availableRacePlugins.forEach(({ key, plugin }) => {
    racePluginRegistry.registerPlugin(plugin, key);
  });
  const chronos = new ChronosImp();
  const charactersRepository = createRepository(racePluginRegistry);
  const charactersQuery = createQuery(racePluginRegistry, chronos);

  return CharactersService(
    racePluginRegistry,
    charactersQuery,
    charactersRepository,
    chronos
  );
}
