import React from 'react'
import CacheRoute from 'react-router-cache-route'

import { KeypairButton } from '@obsidians/keypair'
import { DockerImageSelector } from '@obsidians/docker'
import instance from '@obsidians/algorand-instances'
import compilerManager from '@obsidians/algorand-compiler'
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
            <DockerImageSelector
              channel={instance.node}
              icon='fas fa-hammer'
              title='Algorand'
              noneName='No Algorand installed'
              modalTitle='Algorand Version Manager'
              downloadingTitle='Downloading Algorand'
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
            <DockerImageSelector
              channel={compilerManager.channel}
              icon='fas fa-hammer'
              title='PyTeal'
              noneName='No PyTeal installed'
              modalTitle='PyTeal Version Manager'
              downloadingTitle='Downloading PyTeal'
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
