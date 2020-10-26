import React from 'react'

import { DockerImageSelector } from '@obsidians/docker'
import { BaseProjectManager } from '@obsidians/workspace'
import { instanceChannel } from '@obsidians/algorand-network'

export default () => {
  const [selected, onSelected] = React.useState('')

  React.useEffect(BaseProjectManager.effect('settings:compilers.algorand', onSelected), [])

  return (
    <DockerImageSelector
      channel={instanceChannel.node}
      disableAutoSelection
      size='sm'
      icon='fas fa-hammer'
      title='Algorand'
      noneName='Algorand node'
      modalTitle='Algorand Version Manager'
      downloadingTitle='Downloading Algorand'
      selected={selected}
      onSelected={v => BaseProjectManager.instance.projectSettings?.set('compilers.algorand', v)}
    />
  )
}
