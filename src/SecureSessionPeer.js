const nacl = require('libsodium-wrappers')

//zet private key in closure

module.exports = async() => {
    await nacl.ready
    let keys = nacl.crypto_kx_keypair()
    //let key = nacl.crypto_secretbox_keygen()
    //zet deze in encrypt:
    //let nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES)
    return Object.freeze({
        publicKey: keys.publicKey,
        encrypt: (msg) => {
            return {
                nonce: nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES),
                ciphertext: nacl.crypto_secretbox_easy(msg, nonce, keys.privateKey)
            }
        },
        decrypt: (c, n) => {
            return nacl.crypto_secretbox_open_easy(c, n, keys.publicKey)
        },
        send: (msg) => {

        },
        receive: () => {

        }
    })
}