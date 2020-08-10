const semverLt = require('semver/functions/lt')
const semverValid = require('semver/functions/valid')

const { IpcChannel } = require('@obsidians/ipc')
const { DockerImageChannel } = require('@obsidians/docker')

class PytealManager extends IpcChannel {
  constructor () {
    super('pyteal')
    this.channel = new DockerImageChannel('obsidians/pyteal', {
      filter: tag => semverValid(tag),
      sort: (x, y) => semverLt(x, y) ? 1 : -1
    })
  }

  resize ({ cols, rows }) {
    this.pty.resize({ cols, rows })
  }

  kill () {
    this.pty.kill()
    // Pty.exec(`docker stop substrate_compiler`)
  }
}

module.exports = PytealManager