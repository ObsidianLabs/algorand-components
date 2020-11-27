import { ProjectSettings } from '@obsidians/workspace'

export default class AlgorandProjectSettings extends ProjectSettings {
  static configFileName = 'config.json'

  constructor (settingFilePath, channel) {
    super(settingFilePath, channel)
  }

  trimSettings = (rawSettings = {}) => {
    return {
      language: rawSettings.language || 'teal',
      main: rawSettings.main || '',
      compilers: {
        algorand: rawSettings.compilers?.algorand || '',
        pyteal: rawSettings.compilers?.pyteal || '',
      }
    }
  }
}
