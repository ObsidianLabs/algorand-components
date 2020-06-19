import React, { PureComponent } from 'react'

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from '@obsidians/ui-components'

import algorandNode from './algorandNode'

export default class AlgorandNodeButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      lifecycle: 'stopped'
    }
  }

  componentWillUnmount () {
    if (this.state.lifecycle !== 'stopped') {
      this.stop()
    }
  }

  onLifecycle = (lifecycle, algoNode) => {
    algorandNode.updateLifecycle(lifecycle, algoNode)
    if (this.props.onLifecycle) {
      this.props.onLifecycle(lifecycle, algoNode)
    }
  }

  start = async () => {
    if (this.state.lifecycle !== 'stopped') {
      return
    }
    this.setState({ lifecycle: 'starting' })
    this.onLifecycle('starting')

    const algoNode = await algorandNode.start({
      name: this.props.name,
      version: this.props.version,
      chain: this.props.chain,
    })
    this.setState({ lifecycle: 'started' })
    this.onLifecycle('started', algoNode)
  }

  stop = async () => {
    this.setState({ lifecycle: 'stopping' })
    this.onLifecycle('stopping')

    await algorandNode.stop({
      name: this.props.name,
      version: this.props.version,
      chain: this.props.chain,
    })

    this.setState({ lifecycle: 'stopped' })
    this.onLifecycle('stopped')
  }

  renderStartBtn () {
    // if (this.props.miner) {
    //   return (
    //     <div key='algorand-node-btn-stopped' className='btn-group btn-group-sm'>
    //       <button type='button' className='btn btn-success' onClick={this.start}>
    //         <i className='fas fa-play mr-1' />Start
    //       </button>
  
    //       <UncontrolledDropdown group size='sm'>
    //         <DropdownToggle caret color='success' style={{ paddingLeft: '0.25rem' }} />
    //         <DropdownMenu>
    //           <DropdownItem onClick={() => this.start(false)}>
    //             <i className='fas fa-play mr-2' />Start without miner
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledDropdown>
    //     </div>
    //   )
    // }

    return (
      <div key='algorand-node-btn-stopped-no-miner' className='btn-group btn-group-sm'>
        <button type='button' className='btn btn-success' onClick={() => this.start(false)}>
          <i className='fas fa-play mr-1' />Start
        </button>
      </div>
    )
  }

  render () {
    switch (this.state.lifecycle) {
      case 'stopped':
        return this.renderStartBtn()
      case 'started':
        return (
          <div key='algorand-node-btn-stop' className='btn btn-sm btn-danger' onClick={this.stop}>
            <i className='fas fa-stop mr-1' />Stop
          </div>
        )
      case 'starting':
        return (
          <div key='algorand-node-btn-starting' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Starting
          </div> 
        )
      case 'stopping':
        return (
          <div key='algorand-node-btn-stopping' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Stopping
          </div> 
        )
      default:
        return null
    }
  }
}
