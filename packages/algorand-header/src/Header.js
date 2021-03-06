import React, { PureComponent } from 'react'

import Navbar from '@obsidians/navbar'
import keypairManager from '@obsidians/keypair'
import { NewProjectModal, navbarItem } from '@obsidians/algorand-project'
import { networkManager } from '@obsidians/algorand-network'

import headerActions from './headerActions'

export default class Header extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      keypairs: []
    }
  }

  componentDidMount () {
    keypairManager.loadAllKeypairs().then(this.updateKeypairs)
    keypairManager.onUpdated(this.updateKeypairs)
  }

  updateKeypairs = keypairs => this.setState({ keypairs })

  render () {
    const {
      profile,
      projects,
      selectedProject,
      starred,
      selectedAccount,
      network,
      networkList,
    } = this.props

    const username = profile.get('username') || 'local'
    const navbarLeft = [
      navbarItem(projects, selectedProject, username)
    ]

    const dropdownKeypairs = this.state.keypairs.map(k => ({ id: k.address, name: k.name || <code>{k.address.substr(0, 6)}...{k.address.substr(-4)}</code> }))
    if (!dropdownKeypairs.length) {
      dropdownKeypairs.push({ none: true })
    }
    dropdownKeypairs.unshift({ header: 'keypair manager' })

    const dropdownStarred = starred.map(item => ({ id: item, name: <code>{item.substr(0, 6)}...{item.substr(-4)}</code> }))
    if (dropdownStarred.length) {
      dropdownStarred.unshift({ header: 'starred' })
      dropdownStarred.unshift({ divider: true })
    }

    const accountName = selectedAccount && (this.state.keypairs.find(k => k.address === selectedAccount)?.name || <code>{selectedAccount}</code>)

    const navbarRight = [
      {
        route: 'account',
        title: 'Account',
        icon: 'fas fa-file-invoice',
        selected: { id: selectedAccount, name: accountName },
        dropdown: [...dropdownKeypairs, ...dropdownStarred],
        onClickItem: account => headerActions.selectAccount(network.id, account),
        contextMenu: id => {
          if (!dropdownStarred.find(item => item.id === id)) {
            return null
          }
          return [{
            text: 'Remove from Starred',
            onClick: ({ id }) => headerActions.removeFromStarred(network.id, id),
          }]
        },
      },
      {
        route: 'network',
        title: 'Network',
        icon: network.icon,
        selected: network,
        dropdown: networkList,
        onClickItem: newtorkId => {
          headerActions.updateNetwork(newtorkId)
          networkManager.setNetwork(newtorkId)
        }
      },
    ]

    return (
      <React.Fragment>
        <Navbar
          profile={profile}
          navbarLeft={navbarLeft}
          navbarRight={navbarRight}
        />
        <NewProjectModal />
      </React.Fragment>
    )
  }
}
