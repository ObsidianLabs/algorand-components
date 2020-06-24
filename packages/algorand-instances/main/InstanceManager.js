const fs = require('fs')
const { net } = require('electron')

const { IpcChannel } = require('@obsidians/ipc')

const semverLt = require('semver/functions/lt')

class InstanceManager extends IpcChannel {
  constructor () {
    super('algorand-node')
  }

  async create ({ name, version, address, chain = 'devnet' }) {
    switch (chain) {
      case 'devnet':
        return this.createDevInstance({ name, version, address, chain })
      default:
        return this.createInstance({ name, version, chain })
    }
  }

  async createDevInstance({ name, version, address, chain }) {
    await this.pty.exec(`docker volume create --label version=${version},chain=${chain} algorand-${name}`)
    await this.pty.exec(`docker run --rm -it -v algorand-${name}:/data algorand/stable:${version} /bin/bash -c 'cp genesisfiles/${chain}/genesis.json /data/genesis.json'`)
    
    await this.pty.exec(`docker run -d --rm -it --name algorand-config-${name} -v algorand-${name}:/data algorand/stable:${version} /bin/bash`)
    // await this.pty.exec(`docker cp algorand-config-${name}:/data/genesis.json /tmp/genesis.json`)

    // let genesis = fs.readFileSync(`/tmp/genesis.json`, 'utf8')
    // genesis = JSON.parse(genesis)
    // genesis.alloc = genesis.alloc.map(account => {
    //   if (account.comment === 'pp1') {
    //     account.addr = address
    //   }
    //   return account
    // })

    // fs.writeFileSync(`/tmp/genesis.json`, JSON.stringify(genesis, null, 2), 'utf8')

    await this.pty.exec(`docker cp /tmp/genesis.json algorand-config-${name}:/data/genesis.json`)
    // await this.pty.exec(`docker exec -u root algorand-config-${name} /bin/bash -c "chown ckb:ckb ckb.toml"`)
    await this.pty.exec(`docker stop algorand-config-${name}`)
  }

  async createInstance({ name, version, chain }) {
    await this.pty.exec(`docker volume create --label version=${version},chain=${chain} algorand-${name}`)
    await this.pty.exec(`docker run --rm -it -v algorand-${name}:/data algorand/stable:${version} /bin/bash -c 'cp genesisfiles/${chain}/genesis.json /data/genesis.json'`)

    const subFolder = `${chain}-v1.0`

    await this.pty.exec(`tar xvf latest.tar.gz -C data/${subFolder}`, { cwd: '/tmp/algorand-snapshot' })
    // await this.pty.exec(`rm -rf algorand-snapshot`, { cwd: '/tmp' })

    await this.pty.exec(`docker run -d --rm -it --name algorand-config-${name} -v algorand-${name}:/data algorand/stable:${version} /bin/bash`)
    await this.pty.exec(`docker cp /tmp/algorand-snapshot/data/${subFolder} algorand-config-${name}:/data/${subFolder}`)
    await this.pty.exec(`docker stop algorand-config-${name}`)
  }

  async list (chain = 'devnet') {
    const { logs: volumes } = await this.pty.exec(`docker volume ls --format "{{json . }}"`)
    const instances = volumes.split('\n').filter(Boolean).map(JSON.parse).filter(x => x.Name.startsWith('algorand-'))
    const instancesWithLabels = instances.map(i => {
      const labels = {}
      i.Labels.split(',').forEach(x => {
        const [name, value] = x.split('=')
        labels[name] = value
      })
      i.Labels = labels
      return i
    })
    return instancesWithLabels.filter(x => x.Labels.chain === chain)
  }

  async delete (name) {
    await this.pty.exec(`docker volume rm algorand-${name}`)
  }

  async versions () {
    const { logs: images } = await this.pty.exec(`docker images algorand/stable --format "{{json . }}"`)
    const versions = images.split('\n').filter(Boolean).map(JSON.parse).filter(x => x.Tag.startsWith('2.'))
    return versions
  }

  async deleteVersion (version) {
    await this.pty.exec(`docker rmi algorand/stable:${version}`)
  }

  async remoteVersions (size) {
    const res = await new Promise((resolve, reject) => {
      const request = net.request(`http://registry.hub.docker.com/v1/repositories/algorand/stable/tags`)
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
      .filter(({ name }) => name.startsWith('2.'))
      .sort((x, y) => semverLt(x.name, y.name) ? 1 : -1)
      .slice(0, size)
  }

  async any () {
    const { versions = [] } = await this.versions()
    return !!versions.length
  }
}

module.exports = InstanceManager