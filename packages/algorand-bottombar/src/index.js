import React from 'react'
import CacheRoute from 'react-router-cache-route'

import { AlgorandKeypairButton } from '@obsidians/algorand-keypair'
import { AlgorandVersionSelector } from '@obsidians/algorand-instances'
import { PytealSelector } from '@obsidians/algorand-compiler'
import { TerminalButton } from '@obsidians/algorand-project'

export default function AlgorandBottomBar (props) {
  return (
    <React.Fragment>
      <AlgorandKeypairButton>
        <div className='btn btn-primary btn-sm btn-flat'>
          <i className='fas fa-key' />
        </div>
      </AlgorandKeypairButton>
      <div className='flex-1' />
      <CacheRoute
        path={`/guest/:project`}
        render={() => {
          if (!props.projectValid) {
            return null
          }
          return (
            <AlgorandVersionSelector
              selected={props.nodeVersion}
              onSelected={nodeVersion => props.onSelectNodeVersion(nodeVersion)}
            />
          )
        }}
      />
      <CacheRoute
        path={`/guest/:project`}
        render={() => {
          if (!props.projectValid) {
            return null
          }
          return (
            <PytealSelector
              selected={props.compilerVersion}
              onSelected={compilerVersion => props.onSelectCompiler(compilerVersion)}
            />
          )
        }}
      />
      <CacheRoute
        path={`/guest/:project`}
        component={TerminalButton}
      />
    </React.Fragment>
  )
}
