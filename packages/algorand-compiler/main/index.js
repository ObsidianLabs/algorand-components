const semverLt = require('semver/functions/lt')
const semverValid = require('semver/functions/valid')

const { TerminalChannel } = require('@obsidians/terminal')
const { DockerImageChannel } = require('@obsidians/docker')

class PytealManager extends TerminalChannel {
  constructor () {
    super('pyteal')
    this.dockerChannel = new DockerImageChannel('obsidians/pyteal', {
      filter: tag => semverValid(tag),
      sort: (x, y) => semverLt(x, y) ? 1 : -1
    })
  }
}

module.exports = PytealManager