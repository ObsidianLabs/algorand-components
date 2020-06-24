import { IpcChannel } from '@obsidians/ipc'
import notification from '@obsidians/notification'
import fileOps from '@obsidians/file-ops'
import algosdk from 'algosdk'

class CompilerManager {
  constructor () {
    this.channel = new IpcChannel('pyteal')
    this._terminal = null
    this._button = null
    this.notification = null
  }

  async invoke (method, ...args) {
    return await this.channel.invoke(method, ...args)
  }

  set terminal (v) {
    this._terminal = v
  }

  set button (v) {
    this._button = v
  }

  get projectRoot () {
    if (!this._terminal) {
      throw new Error('CompilerTerminal is not instantiated.')
    }
    return this._terminal.props.cwd
  }

  get nodeVersion () {
    if (!this._button) {
      throw new Error('CompilerButton is not instantiated.')
    }
    return this._button.props.nodeVersion
  }

  get compilerVersion () {
    if (!this._button) {
      throw new Error('CompilerButton is not instantiated.')
    }
    return this._button.props.compilerVersion
  }

  focus () {
    if (this._terminal) {
      this._terminal.focus()
    }
  }

  async build (config = {}) {
    const projectRoot = this.projectRoot
    const nodeVersion = this.nodeVersion
    const compilerVersion = this.compilerVersion

    if (config.language === 'pyteal' && !this.compilerVersion) {
      notification.error('Build Failed', `Does not have PyTeal compiler.`)
      throw new Error('Does not have PyTeal compiler.')
    }
    if (!this.nodeVersion) {
      notification.error('Build Failed', `Does not have Algorand node. Unable to compiler TEAL.`)
      throw new Error('Does not have Algorand node. Unable to compiler TEAL.')
    }

    this._button.setState({ building: true })
    this.notification = notification.info(`Building TEAL`, `Building...`, 0)

    let result
    if (config.language === 'pyteal') {
      let pytealCmd = this.generateDockerPytealBuildCmd(`python ${config.main} > contract.teal`, { projectRoot, compilerVersion })
      result = await this._terminal.exec(pytealCmd)
      if (result.code) {
        this._button.setState({ building: false })
        this.notification.dismiss()
        notification.error('Build Failed', `Code has errors.`)
        throw new Error(result.logs)
      }
    }

    const tealFile = config.language === 'teal' ? config.main : 'contract.teal'
    let tealCmd = this.generateDockerTealBuildCmd(`/root/node/goal clerk compile ${tealFile}`, { projectRoot, nodeVersion })
    result = await this._terminal.exec(tealCmd)
    if (result.code) {
      this._button.setState({ building: false })
      this.notification.dismiss()
      notification.error('Build Failed', `Code has errors.`)
      throw new Error(result.logs)
    }

    let address = result.logs.replace(`${tealFile}: `, '')
    address = address.replace(/\n/g, '').replace(/\r/g, '')
    const contractAddressFile = fileOps.current.path.join(projectRoot, tealFile.replace('.teal', '.addr'))
    await fileOps.current.writeFile(contractAddressFile, address)

    this._button.setState({ building: false })
    this.notification.dismiss()

    notification.success('Build Successful', `Algorand script is built.`)
  }
  
  async buildLogicSig (projectRoot) {
    const compiledTealFile = fileOps.current.path.join(projectRoot, 'contract.teal.tok')
    const compiledTeal = await fileOps.current.readFile(compiledTealFile, 'base64')
    const program = new Uint8Array(Buffer.from(compiledTeal, 'base64'))
    const lsig = algosdk.makeLogicSig(program)
    return lsig
  }

  async stop () {
    if (this._terminal) {
      await this._terminal.stop()
    }
  }

  generateDockerPytealBuildCmd(cmd, { compilerVersion, projectRoot }) {
    return [
      'docker', 'run', '-t', '--rm', '--name', `pyteal_compiler`,
      '--volume', `"${projectRoot}:/project"`,
      '-w', '/project',
      `obsidians/pyteal:${compilerVersion}`,
      '/bin/bash', '-c',
      `"${cmd}"`
    ].join(' ')
  }

  generateDockerTealBuildCmd(cmd, { nodeVersion, projectRoot }) {
    return [
      'docker', 'run', '-t', '--rm', '--name', `teal_compiler`,
      '--volume', `"${projectRoot}:/project"`,
      '-w', '/project',
      `algorand/stable:${nodeVersion}`,
      '/bin/bash', '-c',
      `"${cmd}"`
    ].join(' ')
  }
}

export default new CompilerManager()