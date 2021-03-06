import React, { PureComponent } from 'react'

import {
  TabsWithNavigationBar,
  Modal,
} from '@obsidians/ui-components'

import keypairManager from '@obsidians/keypair'

import AlgorandAccountPage from './AlgorandAccountPage'

import TransferButton from './buttons/TransferButton'
import FaucetButton from './buttons/FaucetButton'

export default class AlgorandAccount extends PureComponent {
  constructor (props) {
    super(props)

    let selectedTabKey = ''
    const address = props.address || ''
    const initialTabs = props.tabs.map((value, index) => {
      const key = `tab-${index}`
      if (value === address) {
        selectedTabKey = key
      }
      return { key, value }
    })
    let initialSelected
    if (!selectedTabKey) {
      initialSelected = { key: `tab-${initialTabs.length}`, value: address }
      initialTabs.push(initialSelected)
    } else {
      initialSelected = { key: selectedTabKey, value: address }
    }

    this.state = {
      initialSelected,
      initialTabs,
      value: address,
    }

    this.tabs = React.createRef()
    this.accountPage = React.createRef()
    this.modal = React.createRef()
    this.keypairs = {}
  }

  componentDidMount () {
    keypairManager.loadAllKeypairs().then(this.updateKeypairs)
    keypairManager.onUpdated(this.updateKeypairs)
  }

  updateKeypairs = keypairs => {
    this.keypairs = {}
    keypairs.forEach(k => {
      this.keypairs[k.address] = k.name
    })
    this.forceUpdate()
  }

  get currentValue () {
    return this.state.value
  }

  openTab = value => {
    this.tabs.current && this.tabs.current.openTab(value)
  }

  // showCellModal = cell => {
  //   this.setState({ cell })
  //   this.modal.current.openModal()
  // }

  onValue = value => {
    this.setState({ value })
    this.props.onValueChanged && this.props.onValueChanged(value)
  }

  onRefresh = () => {
    this.accountPage.current.refresh()
  }

  getTabText = tab => {
    const { value, temp } = tab
    let tabText = ''
    if (this.keypairs[value]) {
      tabText = this.keypairs[value]
    } else if (value.length < 10) {
      tabText = value
    } else {
      tabText = `${value.substr(0, 6)}...${value.slice(-4)}`
    }
    return tabText
  }

  render () {
    const { initialSelected, initialTabs, value } = this.state

    return (
      <React.Fragment>
        <TabsWithNavigationBar
          ref={this.tabs}
          initialSelected={initialSelected}
          initialTabs={initialTabs}
          starred={this.props.starred}
          maxTabWidth={46}
          getTabText={this.getTabText}
          onValue={this.onValue}
          onChangeStarred={this.props.onChangeStarred}
          onRefresh={this.onRefresh}
          onTabsUpdated={this.props.onTabsUpdated}
          NavbarButtons={(
            <React.Fragment>
              <TransferButton address={value} />
              { this.props.network === 'testnet' && <FaucetButton address={value} /> }
            </React.Fragment>
          )}
        >
          <AlgorandAccountPage ref={this.accountPage} value={value} />
        </TabsWithNavigationBar>

        <Modal
          ref={this.modal}
          title='Cell Detail'
        >
        </Modal>
      </React.Fragment>
    )
  }
}
