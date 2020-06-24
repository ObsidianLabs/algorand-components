import React from 'react'

import {
  SplitPane
} from '@obsidians/ui-components'

import { NodeTerminal } from '@obsidians/algorand-node'

import InstanceList from './InstanceList'

const chains = {
  local: 'devnet',
  testnet: 'testnet',
  mainnet: 'mainnet',
}

export default function InstanceListWithTerminal (props) {
  const { active, network = 'testnet', onLifecycle } = props
  const chain = chains[network]
  return (
    <SplitPane
      split='horizontal'
      primary='second'
      defaultSize={260}
      minSize={200}
    >
      <InstanceList chain={chain} onLifecycle={onLifecycle} />
      <NodeTerminal active={active} />
    </SplitPane>
  )
}
