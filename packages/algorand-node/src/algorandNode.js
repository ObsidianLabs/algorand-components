import AlgoSdk from '@obsidians/algorand-sdk'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class AlgorandNode {
  constructor () {
    this._algoSdk = null
    this._terminal = null
  }

  set status (v) {
    this._status = v
  }

  get algoSdk () {
    return this._algoSdk
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

    const [startDocker, runAlgorand, getAlgodToken, streamLogs] = this.generateCommands({ name, version })
    await this._terminal.exec(startDocker)
    await this._terminal.exec(runAlgorand)
    const result = await this._terminal.exec(getAlgodToken)
    this._terminal.onLogReceived('\r\n')
    await this._terminal.exec(streamLogs, { resolveOnFirstLog: true })
    
    if (!result.code) {
      return {
        nodeUrl: 'http://localhost:8080',
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

    const runAlgorand = `docker exec ${containerName} ./goal node start -d /data -l 0.0.0.0:8080`
    const getAlgodToken = `docker exec ${containerName} cat /data/algod.token`
    const streamLogs = `docker exec ${containerName} ./carpenter -color -d /data`

    return [startDocker, runAlgorand, getAlgodToken, streamLogs]
  }

  updateLifecycle (lifecycle, algoNode) {
    if (this._status) {
      this._status.setState({ lifecycle })
    }
    if (algoNode) {
      this._algoSdk = new AlgoSdk(algoNode)
    } else {
      this._algoSdk = null
    }
  }

  updateBlockNumber (blockNumber) {
    if (this._status) {
      this._status.setState({ blockNumber })
    }
  }

  async stop ({ name, version }) {
    if (this._terminal) {
      await this._terminal.exec(`docker stop algorand-${name}-${version}`)
    }
  }
}

export default new AlgorandNode()