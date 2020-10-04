import React from 'react'

import { DockerImageSelector } from '@obsidians/docker'
import compilerManager from '@obsidians/algorand-compiler'

import projectManager from '../projectManager'

export default () => {
  const [language, setLanguage] = React.useState('')
  const [selected, onSelected] = React.useState('')

  React.useEffect(projectManager.effect('settings:language', setLanguage), [])
  React.useEffect(projectManager.effect('settings:compilers.pyteal', onSelected), [])

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
      onSelected={v => projectManager.projectSettings?.set('compilers.pyteal', v)}
    />
  )
}
