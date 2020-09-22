const { TerminalChannel } = require('@obsidians/terminal')
const { DockerImageChannel } = require('@obsidians/docker')

class PytealManager extends TerminalChannel {
  constructor () {
    super('pyteal')
    this.dockerChannel = new DockerImageChannel('obsidians/pyteal')
  }
}

module.exports = PytealManager