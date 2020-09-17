import instance from '@obsidians/algorand-instances'
import compilerManager from '@obsidians/algorand-compiler'
import { dockerChannel } from '@obsidians/docker'

export default async function checkDependencies () {
  try {
    const results = await Promise.all([
      dockerChannel.check(),
      instance.node.installed(),
      compilerManager.channel.installed(),
    ])
    return results.every(x => !!x)
  } catch (e) {
    return false
  }
}