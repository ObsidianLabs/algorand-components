import React from 'react'
import CacheRoute from 'react-router-cache-route'

import { KeypairButton } from '@obsidians/keypair'
import { NodeVersionSelector } from '@obsidians/algorand-instances'
import { PytealSelector } from '@obsidians/algorand-compiler'
import { TerminalButton } from '@obsidians/algorand-project'

export default function BottomBar (props) {
  return (
    <React.Fragment>
      <KeypairButton secretName='Mnemonic'>
        <div className='btn btn-primary btn-sm btn-flat'>
          <i className='fas fa-key' />
        </div>
      </KeypairButton>
      <div className='flex-1' />
      <CacheRoute
        path={`/guest/:project`}
        render={() => {
          if (!props.projectValid) {
            return null
          }
          return (
            <NodeVersionSelector
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
