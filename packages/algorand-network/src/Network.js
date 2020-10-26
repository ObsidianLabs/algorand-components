import React from 'react'

import {
  SplitPane
} from '@obsidians/ui-components'

import { NodeTerminal } from '@obsidians/algorand-node'

import InstanceList from './Instance/InstanceList'

const chains = {
  local: 'devnet',
  testnet: 'testnet',
  mainnet: 'mainnet',
}

export default props => {
  const { active, network = 'testnet' } = props
  const chain = chains[network]
  return (
    <SplitPane
      split='horizontal'
      primary='second'
      defaultSize={260}
      minSize={200}
    >
      <InstanceList chain={chain} />
      <NodeTerminal active={active} />
    </SplitPane>
  )
}
