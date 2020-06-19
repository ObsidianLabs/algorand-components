import React, { PureComponent } from 'react'

import {
  Modal,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import algosdk from 'algosdk'

// const isMnemonic = str => /^0x[0-9A-Fa-f]{64}$/.test(str)

export default class ImportKeypairModal extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      valid: false,
      feedback: '',
      keypair: null,
    }

    this.modal = React.createRef()
  }
  

  openModal () {
    this.modal.current.openModal()
    this.setState({ name: '', keypair: null, valid: false, feedback: '' })
    return new Promise(resolve => this.onResolve = resolve)
  }

  onChange = mnemonic => {
    if (!mnemonic) {
      this.setState({ keypair: null, valid: false, feedback: '' })
    } else {
      try {
        const key = algosdk.mnemonicToSecretKey(mnemonic)
        this.setState({
          keypair: { addr: key.addr, mnemonic },
          valid: true,
          feedback: `Address: ${key.addr}`
        })
      } catch (e) {
        this.setState({ keypair: null, valid: false, feedback: 'Not a valid mnemonic' })
      }
    }
  }

  onConfirm = async () => {
    const { name, keypair } = this.state

    if (!keypair) {
      this.onResolve({})
      return
    }

    this.modal.current.closeModal()
    this.onResolve({ name, keypair })
  }

  render () {
    const {
      name,
      valid,
      feedback,
    } = this.state

    return (
      <Modal
        ref={this.modal}
        title='Import Keypair'
        textConfirm='Import'
        onConfirm={this.onConfirm}
        confirmDisabled={!name || !valid}
      >
        <DebouncedFormGroup
          label='Name'
          maxLength='200'
          placeholder='Please enter a name for the keypair'
          onChange={name => this.setState({ name })}
        />
        <DebouncedFormGroup
          label='Enter the mnemonic you want to import'
          maxLength='200'
          onChange={this.onChange}
          feedback={feedback}
          valid={valid}
        />
      </Modal>
    )
  }
}
