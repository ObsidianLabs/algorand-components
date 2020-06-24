import algosdk from 'algosdk'

import { IpcChannel } from '@obsidians/ipc'

class KeypairManager {
  constructor () {
    this.channel = new IpcChannel('algorand-keypair')
    this.redux = null
  }

  async loadAllKeypairs () {
    const addresses = await this.channel.invoke('allKeypairAddresses')
    const names = this.redux.getState().keypairs
    return addresses.map(addr => ({ addr, name: names.get(addr) }))
  }
  
  async newKeypair () {
    const key = algosdk.generateAccount()
    return {
      addr: key.addr,
      mnemonic: algosdk.secretKeyToMnemonic(key.sk)
    }
  }

  async saveKeypair(name, keypair) {
    await this.channel.invoke('saveKeypair', keypair.addr, keypair.mnemonic)
    this.updateKeypairName(keypair.addr, name)
  }

  updateKeypairName (address, name) {
    this.redux.dispatch('UPDATE_KEYPAIR_NAME', { address, name })
  }

  async deleteKeypair(keypair) {
    await this.channel.invoke('deleteKeypair', keypair.addr)
    this.redux.dispatch('REMOVE_KEYPAIR_NAME', { address: keypair.addr })
  }

  async getSigner(addr) {
    const mnemonic = await this.channel.invoke('loadMnemonic', addr)
    if (!mnemonic) {
      throw new Error('No mnemonic for address: ' + addr)
    }
    const key = algosdk.mnemonicToSecretKey(mnemonic)
    return key.sk
  }
}

export default new KeypairManager()