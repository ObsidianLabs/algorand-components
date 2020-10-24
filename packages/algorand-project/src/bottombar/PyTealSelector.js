import React from 'react'

import { DockerImageSelector } from '@obsidians/docker'
import { BaseProjectManager } from '@obsidians/workspace'
import compilerManager from '@obsidians/algorand-compiler'

export default () => {
  const [language, setLanguage] = React.useState('')
  const [selected, onSelected] = React.useState('')

  React.useEffect(BaseProjectManager.effect('settings:language', setLanguage), [])
  React.useEffect(BaseProjectManager.effect('settings:compilers.pyteal', onSelected), [])

  if (language !== 'pyteal') {
    return null
  }

  return (
    <DockerImageSelector
      channel={compilerManager.pyteal}
      disableAutoSelection
      size='sm'
      icon='fas fa-hammer'
      title='PyTeal'
      noneName='PyTeal'
      modalTitle='PyTeal Version Manager'
      downloadingTitle='Downloading PyTeal'
      selected={selected}
      onSelected={v => BaseProjectManager.instance.projectSettings?.set('compilers.pyteal', v)}
    />
  )
}
