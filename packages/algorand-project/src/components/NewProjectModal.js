import React, { Component } from 'react'

import {
  Modal,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  CustomInput,
  Button,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'
import notification from '@obsidians/notification'
import { IpcChannel } from '@obsidians/ipc'

import actions from '../actions'

export default class NewProjectModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      projectRoot: '',
      template: 'dynamic_fee',
      creating: false
    }

    this.modal = React.createRef()
    this.path = fileOps.current.path
    this.fs = fileOps.current.fs
    this.channel = new IpcChannel('algorand-project')

    actions.newProjectModal = this
  }

  openModal () {
    this.modal.current.openModal()
    return new Promise(resolve => { this.onConfirm = resolve })
  }

  chooseProjectPath = async () => {
    try {
      const projectRoot = await fileOps.current.chooseFolder('Algorand Studio')
      this.setState({ projectRoot })
    } catch (e) {

    }
  }

  onCreateProject = async () => {
    this.setState({ creating: true })

    let created = await this.createProject()

    if (created) {
      this.modal.current.closeModal()
      this.onConfirm(created)
      this.setState({ name: '', projectRoot: '', template: 'dynamic_fee' })
    }
    this.setState({ creating: false })
  }

  createProject = async () => {
    let projectRoot
    const { name, template } = this.state
    if (!this.state.projectRoot) {
      projectRoot = this.path.join(fileOps.current.homePath, 'Algorand Studio', name)
    } else if (!this.path.isAbsolute(this.state.projectRoot)) {
      projectRoot = this.path.join(fileOps.current.homePath, 'Algorand Studio', this.state.projectRoot)
    } else {
      projectRoot = this.state.projectRoot
    }

    if (await fileOps.current.isDirectoryNotEmpty(projectRoot)) {
      notification.error('Cannot Create the Project', `<b>${projectRoot}</b> is not an empty directory.`)
      return false
    }

    try {
      await this.channel.invoke('createProject', { projectRoot, name, template })
    } catch (e) {
      notification.error('Cannot Create the Project', e.message)
      return false
    }

    notification.success('Successful', `New project <b>${name}</b> is created.`)
    return { projectRoot, name }
  }

  render () {
    const { name, creating } = this.state

    let placeholder = 'Project path'
    if (!this.state.projectRoot) {
      placeholder = this.path.join(fileOps.current.homePath, 'Algorand Studio', this.state.name || '')
    }

    return (
      <Modal
        ref={this.modal}
        title='Create a New Project'
        textConfirm='Create Project'
        onConfirm={this.onCreateProject}
        pending={creating && 'Creating...'}
        confirmDisabled={!name}
      >
        <FormGroup>
          <Label>Project location</Label>
          <InputGroup>
            <Input
              placeholder={placeholder}
              value={this.state.projectRoot}
              onChange={e => this.setState({ projectRoot: e.target.value })}
            />
            <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={this.chooseProjectPath}>
                Choose...
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <DebouncedFormGroup
          label='Project name'
          onChange={name => this.setState({ name })}
        />
        <FormGroup>
          <Label>Template</Label>
          <CustomInput
            type='select'
            id='project-template'
            value={this.state.template}
            onChange={event => this.setState({ template: event.target.value })}
          >
            <option value='dynamic_fee'>Dynamic Fee</option>
            <option value='limit_order'>Limit Order</option>
            <option value='periodic_pay'>Periodic Payment</option>
            <option value='htlc'>Hash Time Lock Contract</option>
            <option value='empty'>Empty TEAL Contract</option>
          </CustomInput>
        </FormGroup>
      </Modal>
    )
  }
}
