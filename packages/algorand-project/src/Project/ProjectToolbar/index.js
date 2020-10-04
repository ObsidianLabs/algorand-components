import React, { PureComponent } from 'react'

import { WorkspaceContext } from '@obsidians/workspace'
import { ToolbarButton } from '@obsidians/ui-components'
import { CompilerButton } from '@obsidians/algorand-compiler'

import projectManager from '../../projectManager'
import TestSelector from './TestSelector'

export default class ProjectToolbar extends PureComponent {
  static contextType = WorkspaceContext

  render () {
    const { projectRoot } = this.context

    return (
      <React.Fragment>
        <CompilerButton
          className='rounded-0 border-0 flex-none w-5'
          onClick={() => projectManager.compile()}
        />
        <TestSelector projectRoot={projectRoot} />
        <div className='flex-1' />
        <ToolbarButton
          id='settings'
          icon='fas fa-cog'
          tooltip='Project Settings'
          onClick={() => projectManager.openProjectSettings()}
        />
      </React.Fragment>
    )
  }
}
