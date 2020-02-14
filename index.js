const tupelo = require('tupelo-wasm-sdk')
const fs = require('fs')
const yargs = require('yargs')

const LOCAL_ID_PATH = './.notebook-identifiers'
const CHAIN_TREE_NOTE_PATH = 'notebook/notes'

/**
 * The community the SDK is connecting to in this example is the Tupelo TestNet.
 * The underlying code creates a p2p node and establishes the connections it
 * needs to submit transactions and get back confirmations when transactions are
 * finalized. The Tupelo network is fast so the user can wait the few hundred
 * milliseconds required to process requests in real time. In this way the Tupelo
 * WASM SDK is as easy to use as a standard database API.
 */
async function createNotebook() {
  console.log('creating notebook')
  let community = await tupelo.Community.getDefault()

  // Create a digital signature for the user
  const key = await tupelo.EcdsaKey.generate()

  // use the Tupelo SDK to create a new empty ChainTree to write our notebook entries into
  const tree = await tupelo.ChainTree.newEmptyTree(community.blockservice, key)
  let obj = await identifierObj(key, tree)
  return writeIdentifierFile(obj)
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
  }
}

/**
 * read identifier file, connect to default network, return chainTree for id, or new
 * if not found
 *
 * @returns the notebook ChainTree and the key we have retrieved.
 */
async function readIdentifierFile() {
  let raw = fs.readFileSync(LOCAL_ID_PATH)
  const identifiers = JSON.parse(raw)
  const keyBits = Buffer.from(identifiers.unsafePrivateKey, 'base64')
  const key = await tupelo.EcdsaKey.fromBytes(keyBits)

  // connect to the same default community service we had used to create our notebook ChainTree.
  const community = await tupelo.Community.getDefault()

  // grab the “tip” of our ChainTree which represents the latest version of it
  // from the community service. We need to pass in the chainID from the
  // identifier file to grab the proper notebook
  let tree
  try {
    const tip = await community.getTip(identifiers.chainId)
    console.log('found tree')
    tree = new tupelo.ChainTree({
      store: community.blockservice,
      tip: tip,
      key: key
    })
  } catch (e) {
    if (e === 'not found') {
      // create a new empty ChainTree if we could not find our existing one for some reason.
      tree = await tupelo.ChainTree.newEmptyTree(community.blockservice, key)
    } else {
      throw e
    }
  }
  return { tree: tree, key: key }
}

function writeIdentifierFile(configObj) {
  console.log('saving identifierFile: ', configObj)
  let data = JSON.stringify(configObj)
  fs.writeFileSync(LOCAL_ID_PATH, data)
}

/**
 * To build the actual addNote function, we start by grabbing our identifiers
 * and whatever notes already exist. Because ChainTrees are so flexible, this
 * data can be of nearly any type. We will be storing our notes in an array of
 * strings at ‘notebook/notes’.
 *
 * @param {*} note
 */
async function addNote(note) {
  if (!idFileExists()) {
    console.error(
      'Error: you must register before you can record notes. use "npm run dev:createNotebook"'
    )
    return
  }

  let { tree } = await readIdentifierFile()

  const resp = await tree.resolveData(CHAIN_TREE_NOTE_PATH)
  let notes = resp.value,
    noteWithTs = addTimestamp(note) // Add a time and date to our new entry

  if (notes instanceof Array) {
    notes.push(noteWithTs)
  } else {
    notes = [noteWithTs]
  }

  // The last step we need to take in our addNote function is to actually submit
  // the information to be signed! So we will add the SDK calls to the end of
  // addNote() to do just that. The playTransactions call takes the tree we are
  // changing and the change we want to make to the data as arguments.
  console.log('saving new notes: ', notes)
  let c = await tupelo.Community.getDefault()
  await c.playTransactions(tree, [
    tupelo.setDataTransaction(CHAIN_TREE_NOTE_PATH, notes)
  ])
}

async function showNotes() {
  if (!idFileExists()) {
    console.error('Error: you must register before you can print notes.')
    return
  }

  let { tree } = await readIdentifierFile()
  let resp = await tree.resolveData(CHAIN_TREE_NOTE_PATH)
  let notes = resp.value

  if (notes instanceof Array) {
    console.log('----Notes----')
    notes.forEach(function(note) {
      console.log(note)
    })
  } else {
    console.log('----No Notes-----')
  }
}

/////// utils ///////

function idFileExists() {
  return fs.existsSync(LOCAL_ID_PATH)
}

function addTimestamp(note) {
  let ts = new Date().getTime().toString()
  return ts + '::' + note
}

yargs
  .command(
    'register',
    'Register a new notebook chain tree',
    yargs => {},
    async argv => {
      await createNotebook()
      process.exit(0)
    }
  )
  .command(
    'add',
    'Save a note',
    yargs => {
      yargs
        .describe('n', 'Save a note')
        .alias('n', 'note')
        .demand('n')
    },
    async argv => {
      await addNote(argv.n)
      process.exit(0)
    }
  )
  .command(
    ['print', '$0'], // $0 makes this the default command
    'Print saved notes',
    yargs => {},
    async argv => {
      await showNotes()
      process.exit(0)
    }
  ).argv
