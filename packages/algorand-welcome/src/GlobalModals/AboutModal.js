import React, { PureComponent } from 'react'

import { Modal } from '@obsidians/ui-components'
import fileOps from '@obsidians/file-ops'

import globalModalManager from './globalModalManager'

export default class AboutModal extends PureComponent {
  constructor (props) {
    super(props)
    this.modal = React.createRef()
  }

  componentDidMount () {
    globalModalManager.aboutModal = this
  }

  openModal () {
    this.modal.current.openModal()
  }

  render () {
    return (
      <Modal
        ref={this.modal}
        title='About'
        textCancel='Close'
      >
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <img src={this.props.icon} style={{ background: 'transparent', width: '100px' }} />
          <p className='mt-3'><span className='h4'><b>Algorand Studio</b></span> v{fileOps.current.getAppVersion()}</p>

          <h5 className='small-caps mt-4'>contact us</h5>
          <p>Website: <a href='#' onClick={() => fileOps.current.openLink('https://www.obsidians.io')}>https://www.obsidians.io</a></p>
          {/* <p>Telegram: <a href='#' onClick={() => fileOps.current.openLink('https://t.me/ckb_studio')}>https://t.me/ckb_studio</a></p> */}
        </div>
      </Modal>
    )
  }
}