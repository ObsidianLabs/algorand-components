import React, { PureComponent } from 'react'

import {
  Button,
  UncontrolledTooltip
} from '@obsidians/ui-components'

import algorandCompiler from './algorandCompiler'

export default class AlgorandCompilerButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      building: false
    }
  }

  componentDidMount () {
    algorandCompiler.button = this
  }

  onClick = () => {
    if (this.state.building) {
      algorandCompiler.stop()
    } else if (this.props.onClick) {
      this.props.onClick()
    } else {
      algorandCompiler.build({})
    }
  }

  render () {
    const {
      nodeVersion = 'none',
      compilerVersion = 'none',
      className,
      size = 'sm',
      color = 'default',
    } = this.props

    let icon = <span key='algorand-build-icon'><i className='fas fa-hammer' /></span>
    if (this.state.building) {
      icon = (
        <React.Fragment>
          <span key='algorand-building-icon' className='hover-hide'><i className='fas fa-spinner fa-spin' /></span>
          <span key='algorand-stop-build-icon' className='hover-show'><i className='fas fa-stop-circle' /></span>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Button
          color={color}
          size={size}
          id='tooltip-algorand-build-btn'
          key='tooltip-algorand-build-btn'
          className={`hover-block ${className}`}
          onClick={this.onClick}
        >
          {icon}
        </Button>
        <UncontrolledTooltip trigger='hover' delay={0} placement='bottom' target='tooltip-algorand-build-btn'>
          { this.state.building ? 'Stop Build' : `Build (${nodeVersion}|${compilerVersion})`}
        </UncontrolledTooltip>
      </React.Fragment>
    )
  }
}