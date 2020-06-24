const keytar = require('keytar')

const { IpcChannel } = require('@obsidians/ipc')

class KeypairManager extends IpcChannel {
  constructor() {
    super('algorand-keypair')
  }

  async allKeypairAddresses () {
    const keys = await keytar.findCredentials('@obsidians/algorand-keypair')
    return keys.map(({ account }) => account)
  }

  async loadMnemonic (address) {
    const mnemonic = await keytar.getPassword('@obsidians/algorand-keypair', address)
    if (mnemonic) {
      return mnemonic
    }
  }

  // async newPrivateKey () {
  //   const { logs: privateKey } = await this.pty.exec('openssl rand -hex 32')
  //   return `0x${privateKey.trim()}`
  // }

  async saveKeypair (address, mnemonic) {
    await keytar.setPassword('@obsidians/algorand-keypair', address, mnemonic)
  }

  async deleteKeypair(address) {
    await keytar.deletePassword('@obsidians/algorand-keypair', address)
  }
}

module.exports = KeypairManager
