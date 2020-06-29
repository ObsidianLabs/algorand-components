import notification from '@obsidians/notification'
import redux from '@obsidians/redux'

import { List } from 'immutable'

export const networks = List([
  // {
  //   id: 'local',
  //   group: 'default',
  //   name: 'Local',
  //   fullName: 'Local Dev Network',
  //   icon: 'fas fa-laptop-code',
  //   notification: 'Switched to <b>Local Dev</b> network.',
  // },
  {
    id: 'testnet',
    group: 'default',
    name: 'Testnet',
    fullName: 'Testnet Network',
    icon: 'fas fa-laptop-code',
    notification: 'Switched to <b>Testnet</b> network.',
  }
])


export class HeaderActions {
  constructor() {
    this.history = null
    this.newProjectModal = null
  }

  selectContract (network, contract) {
    redux.dispatch('SELECT_CONTRACT', { network, contract })
  }

  selectAccount (network, account) {
    redux.dispatch('SELECT_ACCOUNT', { network, account })
  }

  removeFromStarred (network, account) {
    redux.dispatch('REMOVE_ACCOUNT', { network, account })
  }

  async setNetwork (newtorkId) {
    if (newtorkId === redux.getState().network) {
      return
    }
    const network = networks.find(n => n.id === newtorkId)
    if (!network) {
      return
    }
    redux.dispatch('SELECT_NETWORK', network.id)
    notification.success(`Network`, network.notification)
    this.history.push(`/network/${network.id}`)
  }
}

export default new HeaderActions()
