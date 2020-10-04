import { ProjectSettings } from '@obsidians/workspace'

export default class AlgorandProjectSettings extends ProjectSettings {
  constructor (settingFilePath, channel) {
    super(settingFilePath, channel)
    this.configFileName = 'config.json'
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
