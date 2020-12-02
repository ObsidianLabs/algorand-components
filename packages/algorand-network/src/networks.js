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
    url: 'https://hk.bsngate.com/api/a831fe50cc554f96b9dc040dd68da36ab8cf13604d2796255411a1211fb776bf/Algorand-Testnet/algodrest',
  }
]

export default List(networkList)