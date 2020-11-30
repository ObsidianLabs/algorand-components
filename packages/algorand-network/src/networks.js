import { List } from 'immutable'

const networkList = [
  {
    id: 'testnet',
    group: 'testnet',
    name: 'Testnet',
    fullName: 'Testnet Network',
    icon: 'fas fa-vial',
    notification: 'Switched to <b>Testnet</b> network.',
  },
  {
    id: 'bsn-testnet',
    group: 'testnet',
    name: 'Testnet by BSN',
    fullName: 'Testnet Network by BSN',
    icon: 'fas fa-vial',
    notification: 'Switched to <b>Testnet</b> provided by BSN.',
    url: 'https://hk.bsngate.com/api/16fd2bbefb2cb58ff5ca0906e981d1ace6e4fad0e298d1d080c8546baab2ccbd/Algorand-Testnet/algodrest',
  }
]

export default List(networkList)