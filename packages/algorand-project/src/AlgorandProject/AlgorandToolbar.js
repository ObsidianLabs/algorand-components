import React from 'react'

import { ToolbarButton } from '@obsidians/ui-components'
import { AlgorandCompilerButton } from '@obsidians/algorand-compiler'

import algorandProjectManager from '../algorandProjectManager'
import AlgorandTestSelector from './AlgorandTestSelector'

export default function AlgorandToolbar ({ projectRoot, compilerVersion, nodeVersion }) {
  return (
    <React.Fragment>
      <AlgorandCompilerButton
        className='rounded-0 border-0 flex-none w-5'
        nodeVersion={nodeVersion}
        compilerVersion={compilerVersion}
        onClick={() => algorandProjectManager.compile()}
      />
      <AlgorandTestSelector projectRoot={projectRoot} />
      <div className='flex-1' />
      <ToolbarButton
        id='settings'
        icon='fas fa-cog'
        tooltip='Project Settings'
        onClick={() => algorandProjectManager.openProjectSettings()}
      />
    </React.Fragment>
  )
}
