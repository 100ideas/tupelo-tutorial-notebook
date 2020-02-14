# tupelo docs - notebook tutoral app

tutorial docs: https://docs.tupelo.org/tutorials/notebook.html

reference implementation (maybe?): https://docs.tupelo.org/tutorials/notebook/index3_js (also local as `docs/index3.js`)


### setup & usage

```sh
# get repo, install packages
git clone https://github.com/100ideas/tupelo-tutorial-notebook.git
cd tupelo-tutorial-notebook
npm install

# initialize chaintree for app 
# - stores chaintree IPLD data in `default/`
# - stores chaintree private key & identifiers in `.notebook-identifiers` (.gitignored)
npm run register

# create note with contents <string>
npm run add <string>

# print list of notes
npm run print
```

### example output
```bash
torchy:~/d/d/0/2/t/notebook-demo on master
$ npm run register

creating notebook
saving identifierFile:  { unsafePrivateKey: 'ajkJ6STNw1ZAhyOmufKd7+Pde2NQjCYvw0AaUaWYiMI=',
  chainId: 'did:tupelo:0xAf2386b5fe6baa8c6e5323d16B23941F3406e3af' }
(finished in 7227 ms)


torchy:~/d/d/0/2/t/notebook-demo on master
$ npm run print

nothing was resolvable
----No Notes-----
(finished in 9902 ms)


torchy:~/d/d/0/2/t/notebook-demo on master
$ npm run add "hi"

nothing was resolvable
saving new notes:  [ '1581677818670::hi' ]
(finished in 9759 ms)


torchy:~/d/d/0/2/t/notebook-demo on master
$ npm run add "these commands take a while!"

found tree
saving new notes:  [ '1581677818670::hi',
  '1581677844160::these commands take a while!' ]
(finished in 12067 ms)


torchy:~/d/d/0/2/t/notebook-demo on master
$ npm run print

found tree
----Notes----
1581677818670::hi
1581677844160::these commands take a while!
(finished in 9675 ms)
```


### selected content from [tutorial docs](https://docs.tupelo.org/tutorials/notebook.html)

#### Testing notebook creation

Let’s test out our progress so far. Start a node repl in your project directory with the node command. Then, from the node prompt run

```
> .load index.js
> createNotebook();
```

This sequence of commands loads our index.js file as if we’d typed each line into the repl and then runs the createNotebook() function.

You should see a confirmation that we are saving our writeIdentifier with a PrivateKey and a chainID in the console. As long as you see those, everything is on track and we can run the .exit command in the node repl session.

Back at the command line we can see a .notebook-identifiers file with our key and chainID in it.

If your repl session is not responding as expected you can look for differences between your index.js and this [index file.](https://docs.tupelo.org/tutorials/notebook/index1_js)