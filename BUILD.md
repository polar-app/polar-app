# Current build notes

## Install lerna 

Must be installed globally because it has its own dependencies and will break node_modules otherwise.

```bash
sudo npm install -g lerna
```

```bash

### bump the version
npm run-script dist-version

### compile latest verison of all modules
lerna run compile

### build the latest webapp.
npm run-script dist-prepare && npm run-script dist-publish

### publish latest version of all packages
npm run-script publish

### will publish cloud hooks to firebase along with functions and webapp 
lerna run dist-release

```
