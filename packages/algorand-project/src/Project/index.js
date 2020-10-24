import Workspace from '@obsidians/workspace'
import fileOps from '@obsidians/file-ops'
import { useBuiltinCustomTabs, modelSessionManager, defaultModeDetector } from '@obsidians/code-editor'
import compilerManager, { CompilerTerminal } from '@obsidians/algorand-compiler'

import AlgorandProjectManager from '../AlgorandProjectManager'

import ProjectToolbar from './ProjectToolbar'
import ProjectSettingsTab from './ProjectSettingsTab'

import addTealLanguage from './languages/teal'

useBuiltinCustomTabs(['markdown'])
modelSessionManager.registerCustomTab('settings', ProjectSettingsTab, 'Project Settings')
modelSessionManager.registerModeDetector(filePath => {
  const { base } = fileOps.current.path.parse(filePath)
  if (base === 'config.json') {
    return 'settings'
  } else if (base.endsWith('.teal')) {
    return 'teal'
  } else {
    return defaultModeDetector(filePath)
  }
})

Workspace.defaultProps = {
  ProjectManager: AlgorandProjectManager,
  compilerManager,
  ProjectToolbar,
  CompilerTerminal,
  addLanguages: () => addTealLanguage(),
}

export default Workspace
