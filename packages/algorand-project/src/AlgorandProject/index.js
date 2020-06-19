import React, { PureComponent } from 'react'

import Workspace, { ProjectLoading, ProjectInvalid } from '@obsidians/workspace'
import fileOps from '@obsidians/file-ops'
import { useBuiltinCustomTabs, modelSessionManager, defaultModeDetector } from '@obsidians/code-editor'
import algorandCompiler, { AlgorandCompilerTerminal } from '@obsidians/algorand-compiler'

import algorandProjectManager from '../algorandProjectManager'
import AlgorandSettings from './AlgorandSettings'

import AlgorandToolbar from './AlgorandToolbar'
import AlgorandSettingsTab from './AlgorandSettingsTab'

useBuiltinCustomTabs(['markdown'])
modelSessionManager.registerCustomTab('settings', AlgorandSettingsTab, 'Project Settings')
modelSessionManager.registerModeDetector(filePath => {
  const { base } = fileOps.current.path.parse(filePath)
  if (base === 'config.json') {
    return 'settings'
  } else {
    return defaultModeDetector(filePath)
  }
})


export default class AlgorandProject extends PureComponent {
  constructor (props) {
    super(props)
    this.workspace = React.createRef()
    this.state = {
      loading: true,
      invalid: false,
      initialFile: undefined,
      terminal: false,
    }
  }

  async componentDidMount () {
    algorandProjectManager.algorandProject = this
    this.prepareProject(this.props.projectRoot)
  }

  async componentDidUpdate (prevProps, prevState) {
    if (this.state.terminal !== prevState.terminal) {
      window.dispatchEvent(new Event('resize'))
    }
    if (this.props.projectRoot !== prevProps.projectRoot) {
      this.prepareProject(this.props.projectRoot)
    }
  }

  async prepareProject (projectRoot) {
    this.setState({ loading: true, invalid: false })

    if (!await fileOps.current.isDirectory(projectRoot)) {
      this.setState({ loading: false, invalid: true })
      return
    }

    this.algorandSettings = new AlgorandSettings(projectRoot)

    try {
      await this.algorandSettings.readSettings()
    } catch (e) {
      this.setState({
        loading: false,
        initialFile: this.algorandSettings.configPath,
      })
      return
    }

    if (await this.algorandSettings.isMainValid()) {
      this.setState({
        loading: false,
        initialFile: this.algorandSettings.mainPath,
      })
      return
    }

    this.setState({
      loading: false,
      initialFile: this.algorandSettings.configPath,
    })
  }

  saveAll = async () => {
    return await this.workspace.current.saveAll()
  }

  toggleTerminal = terminal => {
    this.setState({ terminal })
    if (terminal) {
      algorandCompiler.focus()
    }
  }

  openProjectSettings = () => {
    this.workspace.current.openFile(this.algorandSettings.configPath)
  }

  render () {
    const {
      projectRoot,
      nodeVersion,
      compilerVersion,
      InvalidProjectActions = null,
    } = this.props
    const { terminal } = this.state

    if (this.state.loading) {
      return <ProjectLoading projectRoot={projectRoot} />
    }

    if (this.state.invalid) {
      return (
        <ProjectInvalid projectRoot={projectRoot || '(undefined)'}>
          {InvalidProjectActions}
        </ProjectInvalid>
      )
    }

    return (
      <Workspace
        ref={this.workspace}
        theme={this.props.theme}
        projectRoot={projectRoot}
        initialFile={this.state.initialFile}
        terminal={terminal}
        defaultSize={272}
        Toolbar={(
          <AlgorandToolbar
            projectRoot={projectRoot}
            nodeVersion={nodeVersion}
            compilerVersion={compilerVersion}
          />
        )}
        onToggleTerminal={terminal => algorandProjectManager.toggleTerminal(terminal)}
        Terminal={<AlgorandCompilerTerminal active={terminal} cwd={projectRoot} />}
      />
    )
  }
}