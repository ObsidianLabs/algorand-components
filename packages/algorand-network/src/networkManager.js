import notification from '@obsidians/notification'
import redux from '@obsidians/redux'
import Sdk from '@obsidians/algorand-sdk'
import headerActions from '@obsidians/header'

import { getCachingKeys, dropByCacheKey } from 'react-router-cache-route'

import networks from './networks'

class NetworkManager {
  constructor () {
    this._sdk = null
    this.network = undefined
    this.networks = []
  }

  get sdk () {
    return this._sdk
  }

  async createSdk (params) {
    const sdk = new Sdk(params)
    this._sdk = sdk
  }

  async updateSdk (params) {
    this._sdk = new Sdk(params)
  }

  async setNetwork (network, { redirect = true, notify = true } = {}) {
    if (!network || network.id === redux.getState().network) {
      return
    }

    const cachingKeys = getCachingKeys()
    cachingKeys.filter(key => key.startsWith('contract-') || key.startsWith('account-')).forEach(dropByCacheKey)

    this.network = network
    if (network.url) {
      this._sdk = new Sdk(network)
    } else {
      this._sdk = null
    }

    redux.dispatch('SELECT_NETWORK', network.id)
    if (notify) {
      notification.success(`Network`, network.notification)
    }
    if (redirect) {
      headerActions.updateNetwork(network.id)
    }
  }
}

export default new NetworkManager()
