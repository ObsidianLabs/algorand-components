import React, { PureComponent } from 'react'

import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '@obsidians/ui-components'

import AlgorandVersionModal from './AlgorandVersionModal'

export default class AlgorandVersionSelector extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      installed: [],
    }

    this.modal = React.createRef()
  }

  componentDidMount () {
    this.modal.current.refreshVersions()
  }

  onVersionRefreshed = installed => {
    this.setState({ installed, loading: false })
    if (installed[0] && !this.props.selected) {
      this.props.onSelected(installed[0].Tag)
    }
  }

  onOpenManager = () => {
    this.modal.current.openModal()
  }

  renderItems = () => {
    if (this.state.loading) {
      return (
        <DropdownItem key="algorand-nodes-loading" disabled><i className='fas fa-spin fa-spinner mr-1' />Loading...</DropdownItem>
      )
    }

    if (!this.state.installed.length) {
      return (
        <DropdownItem key="algorand-nodes-none" disabled>(No Algorand installed)</DropdownItem>
      )
    }

    return this.state.installed.map(v => (
      <DropdownItem
        key={`algorand-node-${v.Tag}`}
        active={this.props.selected === v.Tag}
        onClick={() => this.props.onSelected(v.Tag)}
      >
        {v.Tag}
      </DropdownItem>
    ))
  }

  render () {
    return (
      <React.Fragment>
        <UncontrolledButtonDropdown direction='up'>
          <DropdownToggle size='sm' color='default' className='rounded-0 text-muted px-2'>
            <i className='fas fa-server mr-1' />
            Algorand ({this.props.selected || 'none'})
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem header>
              <i className='far fa-desktop mr-2' />Installed
            </DropdownItem>
            {this.renderItems()}
            <DropdownItem divider />
            <DropdownItem onClick={this.onOpenManager}>
              <i className='fas fa-cog mr-1' />
              Algorand Versions...
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <AlgorandVersionModal
          ref={this.modal}
          onVersionRefreshed={this.onVersionRefreshed}
        />
      </React.Fragment>
    )
  }
}
