const nacl = require('libsodium-wrappers')

module.exports = async(key) => {
    if (key === undefined) throw 'no key'
    else {
        return Object.freeze({
            decrypt: (c, n) => { return nacl.crypto_secretbox_open_easy(c, n, key) }
        })
    }
}