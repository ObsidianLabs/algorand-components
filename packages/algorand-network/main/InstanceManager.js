const fs = require('fs')

const { IpcChannel } = require('@obsidians/ipc')
const { DockerImageChannel } = require('@obsidians/docker')

class InstanceManager extends IpcChannel {
  constructor () {
    super('algorand-node')
    this.dockerChannel = new DockerImageChannel('algorand/stable')
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
    await this.exec(`docker volume create --label version=${version},chain=${chain} algorand-${name}`)
    await this.exec(`docker run --rm -it -v algorand-${name}:/data algorand/stable:${version} /bin/bash -c 'cp genesisfiles/${chain}/genesis.json /data/genesis.json'`)
    
    await this.exec(`docker run -d --rm -it --name algorand-config-${name} -v algorand-${name}:/data algorand/stable:${version} /bin/bash`)
    // await this.exec(`docker cp algorand-config-${name}:/data/genesis.json /tmp/genesis.json`)

    // let genesis = fs.readFileSync(`/tmp/genesis.json`, 'utf8')
    // genesis = JSON.parse(genesis)
    // genesis.alloc = genesis.alloc.map(account => {
    //   if (account.comment === 'pp1') {
    //     account.addr = address
    //   }
    //   return account
    // })

    // fs.writeFileSync(`/tmp/genesis.json`, JSON.stringify(genesis, null, 2), 'utf8')

    await this.exec(`docker cp /tmp/genesis.json algorand-config-${name}:/data/genesis.json`)
    // await this.exec(`docker exec -u root algorand-config-${name} /bin/bash -c "chown ckb:ckb ckb.toml"`)
    await this.exec(`docker stop algorand-config-${name}`)
  }

  async createInstance({ name, version, chain }) {
    await this.exec(`docker volume create --label version=${version},chain=${chain} algorand-${name}`)
    await this.exec(`docker run --rm -it -v algorand-${name}:/data algorand/stable:${version} /bin/bash -c 'cp genesisfiles/${chain}/genesis.json /data/genesis.json'`)

    const subFolder = `${chain}-v1.0`

    await this.exec(`tar xvf latest.tar.gz -C data/${subFolder}`, { cwd: '/tmp/algorand-snapshot' })
    // await this.exec(`rm -rf algorand-snapshot`, { cwd: '/tmp' })

    await this.exec(`docker run -d --rm -it --name algorand-config-${name} -v algorand-${name}:/data algorand/stable:${version} /bin/bash`)
    await this.exec(`docker cp /tmp/algorand-snapshot/data/${subFolder} algorand-config-${name}:/data/${subFolder}`)
    await this.exec(`docker stop algorand-config-${name}`)
  }

  async list (chain = 'devnet') {
    const { logs: volumes } = await this.exec(`docker volume ls --format "{{json . }}"`)
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
    await this.exec(`docker volume rm algorand-${name}`)
  }
}

module.exports = InstanceManager