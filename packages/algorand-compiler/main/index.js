const { net } = require('electron')

const { IpcChannel } = require('@obsidians/ipc')

class PytealManager extends IpcChannel {
  constructor () {
    super('pyteal')
  }

  async versions () {
    const { logs: images } = await this.pty.exec(`docker images obsidians/pyteal --format "{{json . }}"`)
    const versions = images.split('\n').filter(Boolean).map(JSON.parse)
    return versions
  }

  async deleteVersion (version) {
    await this.pty.exec(`docker rmi obsidians/pyteal:${version}`)
  }

  async pytealVersions (size = 10) {
    const res = await new Promise((resolve, reject) => {
      const request = net.request(`http://registry.hub.docker.com/v1/repositories/obsidians/pyteal/tags`)
      request.on('response', (response) => {
        let body = ''
        response.on('data', chunk => {
          body += chunk
        })
        response.on('end', () => resolve(body))
      })
      request.end()
    })
    return JSON.parse(res)
      .sort((x, y) => x.name < y.name ? 1 : -1)
      .slice(0, size)
  }

  async any () {
    const { versions = [] } = await this.versions()
    return !!versions.length
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