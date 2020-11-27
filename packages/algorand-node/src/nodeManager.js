import { networkManager } from '@obsidians/algorand-network'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class NodeManager {
  constructor () {
    this._terminal = null
  }

  set terminal (v) {
    this._terminal = v
  }

  set minerTerminal (v) {
    this._minerTerminal = v
  }

  set status (v) {
    this._status = v
  }

  async start ({ name, version, chain }) {
    if (!this._terminal) {
      return
    }

    const [startDocker, runNode, getAlgodToken, streamLogs] = this.generateCommands({ name, version })
    await this._terminal.exec(startDocker)
    await this._terminal.exec(runNode)
    const result = await this._terminal.exec(getAlgodToken)
    this._terminal.onLogReceived('\r\n')
    await this._terminal.exec(streamLogs, {
      resolveOnFirstLog: true,
      stopCommand: `docker stop -t 1 algorand-${name}-${version}`
    })
    
    if (!result.code) {
      return {
        url: 'http://localhost:8080',
        token: result.logs,
      }
    }
  }

  generateCommands ({ name, version }) {
    const containerName = `algorand-${name}-${version}`

    const startDocker = [
      'docker run -dt --rm',
      `--name ${containerName}`,
      `-p 8080:8080`,
      `-v algorand-${name}:/data`,
      `algorand/stable:${version}`,
      `/bin/bash`
    ].join(' ')

    const runNode = `docker exec ${containerName} ./goal node start -d /data -l 0.0.0.0:8080`
    const getAlgodToken = `docker exec ${containerName} cat /data/algod.token`
    const streamLogs = `docker exec ${containerName} ./carpenter -color -d /data`

    return [startDocker, runNode, getAlgodToken, streamLogs]
  }

  updateLifecycle (lifecycle, params) {
    if (this._status) {
      this._status.setState({ lifecycle })
    }
    if (params) {
      networkManager.updateSdk(params)
    }
  }

  updateBlockNumber (blockNumber) {
    if (this._status) {
      this._status.setState({ blockNumber })
    }
  }

  async stop () {
    await this._terminal?.stop()
  }
}

export default new NodeManager()