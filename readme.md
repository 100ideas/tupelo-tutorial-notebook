# tupelo docs - notebook tutoral app

docs https://docs.tupelo.org/tutorials/notebook.html

reference implementation (maybe?): https://docs.tupelo.org/tutorials/notebook/index3_js (also local as `docs/index3.js`)

### selected steps from tutorial 

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