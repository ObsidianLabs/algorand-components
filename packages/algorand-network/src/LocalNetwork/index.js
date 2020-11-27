import React from 'react'

import {
  SplitPane
} from '@obsidians/ui-components'

import { NodeTerminal } from '@obsidians/algorand-node'
import InstanceList from './InstanceList'

export default function LocalNetwork (props) {
  const { active, chain } = props
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
