import React, { PureComponent } from 'react'

import {
  Button,
  Modal,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import { DockerImageInputSelector } from '@obsidians/docker'
import Terminal from '@obsidians/terminal'

import instanceChannel from './instanceChannel'

export default class CreateInstanceButton extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      version: '',
      pending: false,
    }

    this.modal = React.createRef()
    this.terminal = React.createRef()
  }

  onClickButton = () => {
    this.modal.current.openModal()
  }

  onCreateInstance = async () => {
    this.setState({ pending: 'Creating...' })

    if (this.props.chain !== 'devnet') {
      const subFolder = `${this.props.chain}-v1.0`
      const snapshot = `https://algorand-snapshots.s3.us-east-1.amazonaws.com/network/${subFolder}/latest.tar.gz`
  
      await this.terminal.current.exec(`rm -rf algorand-snapshot`, { cwd: '/tmp' })
      await this.terminal.current.exec(`mkdir -p algorand-snapshot/data/${subFolder}`, { cwd: '/tmp' })
      await this.terminal.current.exec(`curl ${snapshot} -o latest.tar.gz`, { cwd: '/tmp/algorand-snapshot' })
    }

    await instanceChannel.invoke('create', {
      name: this.state.name,
      version: this.state.version,
      chain: this.props.chain,
    })
    this.modal.current.closeModal()
    this.setState({ pending: false })
    this.props.onRefresh()
  }

  render () {
    return (
      <React.Fragment>
        <Button
          key='new-instance'
          color='success'
          className={this.props.className}
          onClick={this.onClickButton}
        >
          <i className='fas fa-plus mr-1' />
          New Instance
        </Button>
        <Modal
          ref={this.modal}
          overflow
          title={`New Instance (${this.props.chain})`}
          textConfirm='Create'
          onConfirm={this.onCreateInstance}
          onClosed={() => this.setState({ pending: false })}
          pending={this.state.pending}
          confirmDisabled={!this.state.name || !this.state.version}
        >
          <DebouncedFormGroup
            label='Instance name'
            placeholder='Can only contain alphanumeric characters, dots, hyphens or underscores.'
            maxLength='50'
            value={this.state.name}
            onChange={name => this.setState({ name })}
          />
          <DockerImageInputSelector
            channel={instanceChannel.node}
            label='Algorand version'
            noneName='Algorand node'
            modalTitle='Algorand Version Manager'
            downloadingTitle='Downloading Algorand'
            selected={this.state.version}
            onSelected={version => this.setState({ version })}
          />
          <div style={{ display: this.state.pending ? 'block' : 'none'}}>
            <Terminal
              ref={this.terminal}
              active={!!this.state.pending}
              height='200px'
              logId='algorand-new-instance'
              className='rounded overflow-hidden'
            />
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
