import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import { Bootstrap } from '@libp2p/bootstrap'
import crypto from 'libp2p-crypto'
import { createFromJSON } from '@libp2p/peer-id-factory'
const PeerId = require('peer-id')

export default async function setupLibp2p() {
  const webRtcStar = new WebRTCStar()

  // get keypair
  const keypairStorage = localStorage.getItem('libp2p-peerId2')
  let stringified
  if (keypairStorage) {
    try {
      stringified = JSON.parse(keypairStorage)
    } catch (err) {
      console.error('error parsing saved libp2p keypair')
    }
  }
  if (!stringified) {
    const peerId = await PeerId.create({ bits: 1024, keyType: 'RSA' })
    stringified = JSON.stringify(peerId.toJSON(), null, 2)
    localStorage.setItem('libp2p-peerId2', stringified)
  }

  // Create our libp2p node
  const libp2p = await createLibp2p({
    peerId: await createFromJSON(stringified),
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
    },
    transports: [new WebSockets(), webRtcStar],
    connectionEncryption: [new Noise()],
    streamMuxers: [new Mplex()],
    peerDiscovery: [
      webRtcStar.discovery,
      new Bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
        ],
      }),
    ],
  })

  function log(s) {
    console.log(s)
  }
  // Listen for new peers
  libp2p.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    // log(`Found peer ${peer.id.toString()}`)
  })

  // Listen for new connections to peers
  libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
    const connection = evt.detail
    log(`Connected to ${connection.remotePeer.toString()}`)
  })

  // Listen for peers disconnecting
  libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
    const connection = evt.detail
    log(`Disconnected from ${connection.remotePeer.toString()}`)
  })

  await libp2p.start()
  log(`libp2p id is ${libp2p.peerId.toString()}`)

  // Export libp2p to the window so you can play with the API
  window.libp2p = libp2p

  return libp2p
}
