import React from 'react'
import CacheRoute from 'react-router-cache-route'

import { KeypairButton } from '@obsidians/keypair'
import { TerminalButton, AlgorandSelector, PyTealSelector } from '@obsidians/algorand-project'

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
          return <>
            <AlgorandSelector />
            <PyTealSelector />
          </>
        }}
      />
      <CacheRoute
        path={`/guest/:project`}
        component={TerminalButton}
      />
    </React.Fragment>
  )
}
