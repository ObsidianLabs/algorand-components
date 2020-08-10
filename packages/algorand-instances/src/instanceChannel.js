import { IpcChannel } from '@obsidians/ipc'
import { DockerImageChannel } from '@obsidians/docker'

const channel = new IpcChannel('algorand-node')

channel.node = new DockerImageChannel('algorand/stable')

export default channel
