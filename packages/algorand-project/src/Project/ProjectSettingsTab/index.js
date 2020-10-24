import React from 'react'

import {
  FormGroup,
  Label,
  CustomInput,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import {
  WorkspaceContext,
  BaseProjectManager,
  AbstractProjectSettingsTab,
  ProjectPath,
} from '@obsidians/workspace'

import { DockerImageInputSelector } from '@obsidians/docker'
import instance from '@obsidians/algorand-instances'
import compilerManager from '@obsidians/algorand-compiler'

export default class ProjectSettingsTab extends AbstractProjectSettingsTab {
  static contextType = WorkspaceContext

  componentDidMount () {
    BaseProjectManager.channel.on('settings', this.debouncedUpdate)
  }
  
  componentWillUnmount () {
    BaseProjectManager.channel.off('settings', this.debouncedUpdate)
  }

  render () {
    const { projectRoot, projectSettings } = this.context

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
                id='settings-language'
                type='select'
                className='bg-black'
                value={projectSettings?.get('language')}
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
              value={projectSettings?.get('main')}
              onChange={this.onChange('main')}
              placeholder='Required'
            />

            <h4 className='mt-4'>Compiler</h4>
            <DockerImageInputSelector
              channel={instance.node}
              disableAutoSelection
              bg='bg-black'
              label='TEAL compiler (integrated in Algorand node)'
              noneName='Algorand node'
              modalTitle='Algorand Version Manager'
              downloadingTitle='Downloading Algorand'
              selected={projectSettings?.get('compilers.algorand')}
              onSelected={v => this.onChange('compilers.algorand')(v)}
            />
            {
              projectSettings?.get('language') === 'pyteal' &&
              <DockerImageInputSelector
                channel={compilerManager.pyteal}
                disableAutoSelection
                bg='bg-black'
                label='PyTeal version'
                noneName='PyTeal'
                modalTitle='PyTeal Version Manager'
                downloadingTitle='Downloading PyTeal'
                selected={projectSettings?.get('compilers.pyteal')}
                onSelected={v => this.onChange('compilers.pyteal')(v)}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}
