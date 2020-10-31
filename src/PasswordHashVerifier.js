const nacl = require('libsodium-wrappers')

module.exports = async() => {
    return Object.freeze({
        verify: (hash, pw) => { return nacl.crypto_pwhash_str_verify(hash, pw) }
    })
}