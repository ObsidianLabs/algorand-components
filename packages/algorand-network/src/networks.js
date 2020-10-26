import { List } from 'immutable'

const networkList = [
  // {
  //   id: 'local',
  //   group: 'default',
  //   name: 'Local',
  //   fullName: 'Local Dev Network',
  //   icon: 'fas fa-laptop-code',
  //   notification: 'Switched to <b>Local Dev</b> network.',
  // },
  {
    id: 'testnet',
    group: 'default',
    name: 'Testnet',
    fullName: 'Testnet Network',
    icon: 'fas fa-laptop-code',
    notification: 'Switched to <b>Testnet</b> network.',
  }
]

export default List(networkList)