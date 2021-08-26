import React, { PureComponent } from 'react'

import {
  ToolbarButton,
  Modal,
  FormGroup,
  Label,
  CustomInput,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'
import platform from '@obsidians/platform'
import notification from '@obsidians/notification'

export default class TestSelector extends PureComponent {
  constructor (props) {
    super(props)
    this.modal = React.createRef()
    this.state = {
      selected: '',
      files: [],
      running: false,
    }
  }

  openModal = () => {
    this.refreshTestFiles()
    this.modal.current.openModal()
  }

  refreshTestFiles = async () => {
    const testFolder = fileOps.current.path.join(this.props.projectRoot, 'tests')
    console.log(this.props.projectManager);
    let files
    if (platform.isDesktop) {
      files = fileOps.current.fs.readdirSync(testFolder)
      files = files.filter(file => file.endsWith('.json'))
    } else {
      const { prefix, userId, projectId } = this.props.projectManager
      files = await fileOps.current.fs.list(`${prefix}/${userId}/${projectId}/tests`)
      files = files.map(file => file.name).filter(file => file.endsWith('.json'))
    }
    let selected = files[0]
    if (files.indexOf(this.state.selected) > -1) {
      selected = this.state.selected
    }
    this.setState({ files, selected })
  }

  runTest = async () => {
    this.setState({ running: true })
    try {
      const result = await this.props.projectManager.testTransaction(this.state.selected)
      if (result) {
        notification.success('Test Transaction Pushed', `Transaction ID: <code>${result.txId}</code>`)
      }
    } catch (e) {
      console.error(e)
      notification.error('Test Failed', e.message)
    }
    this.setState({ running: false })
  }

  render () {
    return (
      <React.Fragment>
        <ToolbarButton
          id='test'
          icon='fas fa-vial'
          tooltip='Test Transaction'
          onClick={this.openModal}
        />
        <Modal
          ref={this.modal}
          title='Test Transaction'
          textConfirm='Run Test Transaction'
          onConfirm={this.runTest}
          pending={this.state.running && 'Pushing Transaction...'}
        >
          <FormGroup>
            <Label>Test</Label>
            <CustomInput
              id='test-selector'
              type='select'
              value={this.state.selected}
              onChange={event => {
                this.setState({ selected: event.target.value })
              }}
            >
              {this.state.files.map(file => <option key={file} value={file}>{file}</option>)}
            </CustomInput>
          </FormGroup>
        </Modal>
      </React.Fragment>
    )
  }
}
