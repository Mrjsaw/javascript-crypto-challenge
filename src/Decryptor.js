const nacl = require('libsodium-wrappers')

module.exports = (key) => {
    if (key === undefined) throw 'no key'
    else {
        return Object.freeze({
            key: key,
            decrypt: (c, n) => { return nacl.crypto_secretbox_open_easy(c, n, key) }
        })
    }
}