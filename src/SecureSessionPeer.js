const nacl = require('libsodium-wrappers')
const Encryptor = require('./Encryptor')
const Decryptor = require('./Decryptor')


//zet private key in closure
let message;

module.exports = async(peer) => {
    await nacl.ready;
    let keys = nacl.crypto_kx_keypair();
    let otherPeer = peer;
    let encryptor, decryptor, rx, tx;
    let [pk, sk] = [keys.publicKey, keys.privateKey]
    let secureSessionPeer = {
        publicKey: pk,
        //establish a connection between two peers with session keys
        connector: async(otherPeer) => {
            let sKeys = nacl.crypto_kx_client_session_keys(pk, sk, otherPeer.publicKey);
            rx = sKeys.sharedRx;
            tx = sKeys.sharedTx;
            encryptor = await Encryptor(tx);
            decryptor = await Decryptor(rx);
        },
        encrypt: (message) => {
            return encryptor.encrypt(message);
        },
        decrypt: (c, n) => {
            return decryptor.decrypt(c, n)
        },
        send: (msg) => {
            message = encryptor.encrypt(msg);
        },
        receive: () => {
            return decryptor.decrypt(message.ciphertext, message.nonce);
        }
    }

    Object.freeze(secureSessionPeer);


    if (otherPeer !== undefined) {
        let keyPair = nacl.crypto_kx_server_session_keys(pk, sk, otherPeer.publicKey)
        rx = keyPair.sharedRx;
        tx = keyPair.sharedTx;

        otherPeer.connector(secureSessionPeer)
        encryptor = await Encryptor(tx);
        decryptor = await Decryptor(rx);
    }
    return secureSessionPeer;
}