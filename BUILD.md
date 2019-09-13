# Current build notes

```bash

### bump the version
lerna version patch

### compile latest verison of all modules
lerna run compile

### build the lastest webapp.
lerna run dist

### publish latest version of all packages
npm run-script publish

### will publish cloud hooks to firebase along with functions and webapp 
lerna run dist-release

```
