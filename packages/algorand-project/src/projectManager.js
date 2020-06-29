import fileOps from '@obsidians/file-ops'
import notification from '@obsidians/notification'
import keypairManager from '@obsidians/keypair'
import compilerManager from '@obsidians/algorand-compiler'
import { signatureProvider } from '@obsidians/algorand-sdk'
import nodeManager from '@obsidians/algorand-node'

class ProjectManager {
  constructor () {
    this.project = null
    this.modal = null
    this.button = null
  }
  
  set algorandProject (project) {
    this.project = project
  }
  get algorandProject () {
    return this.project
  }

  set terminalButton (button) {
    this.button = button
  }

  get projectRoot () {
    return this.project.props.projectRoot
  }

  get compilerVersion () {
    return this.project.props.compilerVersion
  }

  openProjectSettings () {
    if (this.project) {
      this.project.openProjectSettings()
    }
  }

  async checkSettings () {
    if (!this.project) {
      return
    }

    // notification.info('Not in Code Editor', 'Please switch to code editor and build.')
    // return

    const projectRoot = this.projectRoot
    if (!projectRoot) {
      notification.error('No Project', 'Please open a project first.')
      return
    }

    const settings = await this.project.projectSettings.readSettings()
    return settings
  }

  async compile () {
    let settings
    try {
      settings = await this.checkSettings()
    } catch (e) {
      return false
    }

    const main = settings.main
    if (!main) {
      notification.error('No Main File', 'Please specify a main file in project settings.')
      return false
    }

    await this.project.saveAll()
    this.toggleTerminal(true)

    try {
      await compilerManager.build(settings)
    } catch (e) {
      return false
    }

    return true
  }

  async testTransaction (testFile) {
    if (!nodeManager.algoSdk) {
      notification.error('No Running Node', 'Please start an Algorand node first.')
      return false
    }

    const path = fileOps.current.path
    const testFilePath = path.join(this.projectRoot, 'tests', testFile)
    let testJson = await fileOps.current.readFile(testFilePath)

    const files = {}
    const regex = /\"(file|base64):([^"]+)\"/g
    const testFileDir = path.parse(testFilePath).dir

    let match = regex.exec(testJson)
    while (match) {
      const type = match[1]
      let filePath = match[2]
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(testFileDir, filePath)
      }
      if (!files[filePath]) {
        files[filePath] = []
      }
      files[filePath].push([type, match[0]])

      match = regex.exec(testJson);
    }

    for (const filePath in files) {
      const content = await fileOps.current.readFile(filePath, 'utf8')
      let base64 = ''

      files[filePath].forEach(([type, replacing]) => {
        if (type === 'file') {
          testJson = testJson.replace(replacing, `"${content}"`)
        } else if (type === 'base64') {
          if (!base64) {
            base64 = Buffer.from(content, 'utf8').toString('base64')
          }
          testJson = testJson.replace(replacing, `"${base64}"`)
        }
      })
    }

    let txn
    try {
      txn = JSON.parse(testJson)
    } catch (e) {
      console.warn(e)
      return
    }

    console.log(txn)

    const keypairs = await keypairManager.loadAllKeypairs()
    txn.accounts = keypairs.concat(txn.accounts)

    const algoTxn = nodeManager.algoSdk.newTransaction(txn, signatureProvider)

    await algoTxn.sign()
    return await algoTxn.push()
  }

  toggleTerminal (terminal) {
    if (this.button) {
      this.button.setState({ terminal })
    }
    if (this.project) {
      this.project.toggleTerminal(terminal)
    }
  }
}

export default new ProjectManager()