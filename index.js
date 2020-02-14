const tupelo = require('tupelo-wasm-sdk');
const fs = require('fs');

const LOCAL_ID_PATH = './.notebook-identifiers';

/**
 * The community the SDK is connecting to in this example is the Tupelo TestNet.
 * The underlying code creates a p2p node and establishes the connections it
 * needs to submit transactions and get back confirmations when transactions are
 * finalized. The Tupelo network is fast so the user can wait the few hundred
 * milliseconds required to process requests in real time. In this way the Tupelo
 * WASM SDK is as easy to use as a standard database API.
 */
async function createNotebook() {
  console.log("creating notebook")
  let community = await tupelo.Community.getDefault();
  
  // Create a digital signature for the user
  const key = await tupelo.EcdsaKey.generate()

  // use the Tupelo SDK to create a new empty ChainTree to write our notebook entries into
  const tree = await tupelo.ChainTree.newEmptyTree(community.blockservice, key)

  let obj = await identifierObj(key, tree);
  return writeIdentifierFile(obj);
}


/**
 * compose our identifier object. 
 * We will be storing users PrivateKey locally in a file and in plain text. For
 * a real application that is clearly unacceptable. 
 *
 * @param {*} key : private key
 * @param {*} chain : chaintree instance
 * @returns
 */
async function identifierObj(key, chain) {
  return {
      unsafePrivateKey: Buffer.from(key.privateKey).toString('base64'),
      chainId: await chain.id()
  };
}

function writeIdentifierFile(configObj) {
  console.log("saving identifierFile: ", configObj)
  let data = JSON.stringify(configObj);
  fs.writeFileSync(LOCAL_ID_PATH, data);
}