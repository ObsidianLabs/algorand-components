import { dockerChannel } from '@obsidians/docker'
import { instanceChannel } from '@obsidians/algorand-network'
import compilerManager from '@obsidians/algorand-compiler'

export default async function checkDependencies () {
  try {
    const results = await Promise.all([
      dockerChannel.check(),
      instanceChannel.node.installed(),
      compilerManager.pyteal.installed(),
    ])
    return results.every(x => !!x)
  } catch (e) {
    return false
  }
}