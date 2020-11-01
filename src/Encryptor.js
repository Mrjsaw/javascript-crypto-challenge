const nacl = require('libsodium-wrappers')

module.exports = async(key) => {
    await nacl.ready;
    if (key === undefined) throw 'no key'
    else {
        return Object.freeze({
            encrypt: (m) => {
                n = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
                c = nacl.crypto_secretbox_easy(m, n, key)
                return {
                    nonce: n,
                    ciphertext: c
                }
            }
        })
    }
}