import React from 'react'

import LocalNetwork from './LocalNetwork'
import RemoteNetwork from './RemoteNetwork'

export default props => {
  const { active, network } = props
  if (network === 'testnet') {
    return <LocalNetwork chain={network} active={active} />
  }
  return <RemoteNetwork chain={network} />
}
