import React from 'react'

import { DockerImageSelector } from '@obsidians/docker'
import instance from '@obsidians/algorand-instances'

import projectManager from '../projectManager'

export default () => {
  const [selected, onSelected] = React.useState('')

  React.useEffect(projectManager.effect('settings:compilers.algorand', onSelected), [])

  return (
    <DockerImageSelector
      channel={instance.node}
      disableAutoSelection
      size='sm'
      icon='fas fa-hammer'
      title='Algorand'
      noneName='Algorand node'
      modalTitle='Algorand Version Manager'
      downloadingTitle='Downloading Algorand'
      selected={selected}
      onSelected={v => projectManager.projectSettings?.set('compilers.algorand', v)}
    />
  )
}
