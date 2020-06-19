import React, { PureComponent } from 'react'

import fileOps from '@obsidians/file-ops'
import { modelSessionManager } from '@obsidians/code-editor'

import {
  FormGroup,
  Label,
  CustomInput,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import ProjectPath from '../../components/ProjectPath'

import set from 'lodash/set'

export default class AlgorandSettingsTab extends PureComponent {
  constructor (props) {
    super(props)

    this.onChangeHandlers = {}
    this.state = {
      invalid: false,
      settings: {}
    }
  }

  componentDidMount () {
    this.refreshSettings(this.props.modelSession.value)
  }

  refreshSettings = settingsJson => {
    let rawSettings
    try {
      rawSettings = JSON.parse(settingsJson || '{}')
    } catch (e) {
      this.setState({ invalid: true })
      return
    }

    const settings = this.trimSettings(rawSettings)
    this.setState({ settings })
  }

  trimSettings = (rawSettings = {}) => {
    return {
      language: rawSettings.language || 'teal',
      main: rawSettings.main || '',
    }
  }

  onChange = key => {
    if (!this.onChangeHandlers[key]) {
      this.onChangeHandlers[key] = async value => {
        const settings = this.state.settings
        set(settings, key, value)
        this.forceUpdate()
        await this.updateProjectSettings(settings)
      }
    }
    return this.onChangeHandlers[key]
  }

  async updateProjectSettings(rawSettings) {
    const settings = this.trimSettings(rawSettings)
    const settingsJson = JSON.stringify(settings, null, 2)
    await fileOps.current.writeFile(this.props.modelSession.filePath, settingsJson)
  }

  render () {
    const projectRoot = modelSessionManager._codeEditor.projectRoot
    const settings = this.trimSettings(this.state.settings)

    return (
      <div className='custom-tab bg2'>
        <div className='jumbotron bg-transparent text-body'>
          <div className='container'>
            <h1>Project Settings</h1>
            <ProjectPath projectRoot={projectRoot} />

            <h4 className='mt-4'>General</h4>
            <FormGroup>
              <Label>Project language</Label>
              <CustomInput
                type='select'
                className='bg-black'
                value={settings.language}
                onChange={event => this.onChange('language')(event.target.value)}
              >
                <option value='teal'>TEAL</option>
                <option value='pyteal'>PyTeal</option>
              </CustomInput>
            </FormGroup>
            <DebouncedFormGroup
              code
              label='Main file'
              className='bg-black'
              value={settings.main}
              onChange={this.onChange('main')}
              placeholder={`Required`}
            />
          </div>
        </div>
      </div>
    )
  }
}
