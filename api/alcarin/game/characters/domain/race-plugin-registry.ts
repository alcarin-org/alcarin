import { RacePlugin } from './race-plugin';
import { pluginAlreadyRegistered, raceNotFound } from './errors';

export class RacePluginRegistry {
  private plugins: RacePlugin[] = [];

  public registerPlugin(racePlugin: RacePlugin, raceKey: string) {
    if (this.findPluginForKey(raceKey)) {
      throw pluginAlreadyRegistered(raceKey);
    }
    this.plugins.push(racePlugin);
  }

  public getRaceForKey(raceKey: string) {
    const plugin = this.findPluginForKey(raceKey);
    if (!plugin) {
      throw raceNotFound(raceKey);
    }
    return plugin.properties();
  }

  private findPluginForKey(raceKey: string) {
    return this.plugins.find(plugin => plugin.is(raceKey));
  }
}
