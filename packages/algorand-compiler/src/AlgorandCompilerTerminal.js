import React from 'react'

import Terminal from '@obsidians/terminal'

import algorandCompiler from './algorandCompiler'

export default function (props) {
  return (
    <Terminal
      {...props}
      ref={ref => (algorandCompiler.terminal = ref)}
      logId='algorand-compiler'
      input
    />
  )
}