import algorandKeypairManager from './algorandKeypairManager'

export default function signatureProvider (addr) {
  return async ({ algoTxn, logicSig, raw = false }) => {
    const sk = await algorandKeypairManager.getSigner(addr)
    if (logicSig) {
      return logicSig.sign(sk)
    } else if (raw) {
      return algoTxn.rawSignTxn(sk)
    } else {
      return algoTxn.signTxn(sk)
    }
  }
}