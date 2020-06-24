import React, { PureComponent } from 'react'

import {
  Button,
  Modal,
  FormGroup,
  Label,
  DebouncedFormGroup,
  CustomInput,
} from '@obsidians/ui-components'

import keypairManager from '@obsidians/algorand-keypair'
import Terminal from '@obsidians/terminal'

import instanceChannel from './instanceChannel'

export default class CreateInstanceButton extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      versions: [],
      keypairs: [],
      name: '',
      selected: '',
      addr: '',
      creating: false,
    }

    this.modal = React.createRef()
    this.terminal = React.createRef()
  }

  componentDidMount () {
    this.refresh()
  }

  refresh = async () => {
    this.setState({ loading: true })
    const versions = await instanceChannel.invoke('versions')
    const keypairs = await keypairManager.loadAllKeypairs()
    this.setState({
      versions,
      loading: false,
      keypairs,
      selected: versions[0] ? versions[0].Tag : '',
      addr: keypairs[0] ? keypairs[0].addr : '',
    })
  }

  onClickButton = () => {
    this.refresh()
    this.modal.current.openModal()
  }

  onCreateInstance = async () => {
    this.setState({ creating: 'Creating...' })

    if (this.props.chain !== 'devnet') {
      const subFolder = `${this.props.chain}-v1.0`
      const snapshot = `https://algorand-snapshots.s3.us-east-1.amazonaws.com/network/${subFolder}/latest.tar.gz`
  
      await this.terminal.current.exec(`rm -rf algorand-snapshot`, { cwd: '/tmp' })
      await this.terminal.current.exec(`mkdir -p algorand-snapshot/data/${subFolder}`, { cwd: '/tmp' })
      await this.terminal.current.exec(`curl ${snapshot} -o latest.tar.gz`, { cwd: '/tmp/algorand-snapshot' })
    }

    await instanceChannel.invoke('create', {
      name: this.state.name,
      version: this.state.selected,
      address: this.state.addr,
      chain: this.props.chain,
    })
    this.modal.current.closeModal()
    this.setState({ creating: false })
    this.props.onRefresh()
  }

  renderAlgorandVersionOptions = () => {
    if (this.state.loading) {
      return 'Loading'
    }

    if (!this.state.versions.length) {
      return <option disabled key='' value=''>(No Algorand installed)</option>
    }

    return this.state.versions.map(v => <option key={v.Tag} value={v.Tag}>{v.Tag}</option>)
  }

  renderAddrInput = () => {
    if (this.props.chain !== 'devnet') {
      return null
    }
    return (
      <FormGroup>
        <Label>Address</Label>
        <CustomInput
          type='select'
          className='form-control'
          value={this.state.addr}
          onChange={event => this.setState({ addr: event.target.value })}
        >
          {this.renderAddrOptions()}
        </CustomInput>
      </FormGroup>
    )
  }

  renderAddrOptions = () => {
    if (this.state.loading) {
      return 'Loading'
    }

    if (!this.state.keypairs.length) {
      return <option disabled key='' value=''>(No CKB keypairs)</option>
    }

    return this.state.keypairs.map(k => <option key={k.addr} value={k.addr}>{k.addr}</option>)
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
          title={`New Instance (${this.props.chain})`}
          textConfirm='Create'
          onConfirm={this.onCreateInstance}
          pending={this.state.creating}
          confirmDisabled={!this.state.name || !this.state.selected}
        >
          <DebouncedFormGroup
            label='Instance name'
            placeholder='Can only contain alphanumeric characters, dots, hyphens or underscores.'
            maxLength='50'
            value={this.state.name}
            onChange={name => this.setState({ name })}
          />
          <FormGroup>
            <Label>Algorand version</Label>
            <CustomInput
              type='select'
              className='form-control'
              value={this.state.selected}
              onChange={event => this.setState({ selected: event.target.value })}
            >
              {this.renderAlgorandVersionOptions()}
            </CustomInput>
          </FormGroup>
          <div style={{ display: this.state.creating ? 'block' : 'none'}}>
            <Terminal
              ref={this.terminal}
              active={!!this.state.creating}
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
