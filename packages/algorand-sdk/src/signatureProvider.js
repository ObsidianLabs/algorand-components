import algosdk from 'algosdk'
import keypairManager from '@obsidians/keypair'

export default function signatureProvider (addr) {
  return async ({ algoTxn, logicSig, raw = false }) => {
    const mnemonic = await keypairManager.getSecret(addr)
    const key = algosdk.mnemonicToSecretKey(mnemonic)

    if (logicSig) {
      return logicSig.sign(key.sk)
    } else if (raw) {
      return algoTxn.rawSignTxn(key.sk)
    } else {
      return algoTxn.signTxn(key.sk)
    }
  }
}