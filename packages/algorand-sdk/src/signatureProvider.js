import keypairManager from '@obsidians/keypair'

export default function signatureProvider (addr) {
  return async ({ algoTxn, logicSig, raw = false }) => {
    const sk = await keypairManager.getSigner(addr)
    if (logicSig) {
      return logicSig.sign(sk)
    } else if (raw) {
      return algoTxn.rawSignTxn(sk)
    } else {
      return algoTxn.signTxn(sk)
    }
  }
}