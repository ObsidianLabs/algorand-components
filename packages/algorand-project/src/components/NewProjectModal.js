import React, { Component } from 'react'

import {
  Modal,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
  DebouncedFormGroup,
  DropdownInput,
  Badge,
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
    this.channel = new IpcChannel('project')

    actions.newProjectModal = this
  }

  openModal () {
    this.modal.current.openModal()
    return new Promise(resolve => { this.onConfirm = resolve })
  }

  chooseProjectPath = async () => {
    try {
      const projectRoot = await fileOps.current.chooseFolder()
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
      projectRoot = this.path.join(fileOps.current.workspace, name)
    } else if (!this.path.isAbsolute(this.state.projectRoot)) {
      projectRoot = this.path.join(fileOps.current.workspace, this.state.projectRoot)
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
      placeholder = this.path.join(fileOps.current.workspace, this.state.name || '')
    }

    return (
      <Modal
        ref={this.modal}
        overflow
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
        <DropdownInput
          label='Template'
          options={[
            {
              group: 'TEAL',
              badge: 'TEAL',
              children: [
                { id: 'empty', display: 'Empty TEAL Contract' },
                { id: 'htlc', display: 'Hash Time Lock Contract' },
              ],
            },
            {
              group: 'PyTeal',
              badge: 'PyTeal',
              children: [
                { id: 'dynamic_fee', display: 'Dynamic Fee' },
                { id: 'periodic_pay', display: 'Periodic Payment' },
                { id: 'limit_order', display: 'Limit Order' },
              ],
            },
          ]}
          value={this.state.template}
          onChange={template => this.setState({ template })}
        />
      </Modal>
    )
  }
}
