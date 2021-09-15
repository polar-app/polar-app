# Overview

Polar is a lerna multi-module and typescript build system setup in a monorepo
with all the code kept in one place.

# Stack

- Typescript - Everything is done in Typescript with generics
- Webpack
- Lerna - provides our multi-module system
- Firebase - provides the backend (Firestore)

# External Libraries / Frameworks

- Material UI
- pdf.js
- epub.js

# Steps to Build

- If you're on Windows you should download the latest version of Windows Subsystem for Linux.

- Install `docker`. Make sure to follow
  the [post installation steps](https://docs.docker.com/engine/install/linux-postinstall/) as well so you can run
  all `docker` commands without the sudo prefix.
- Validate that you can run Docker container by running exactly this command: `docker run hello-world`. If it succeeds,
  you are good to go.

  - rebooting after installiation of docker is advised.

- Run `npm run bash` (from insite your git repository) which launches a Docker container and steps you into the `bash` terminal of that container. Note
  that the Polar source code is "mounted" to the /polar-app folder within the container. Any change you do to files within
  that folder within the container, is reflected outside the container and vice versa.

- Now is the time to install all dependencies of all packages. Use `lerna bootstrap` to do that (remember that we need
  to run this within the bash of the container)

- To compile all packages, run `lerna run compile`

- To compile only Polar Bookshelf (the main React app), go to `cd packages/polar-bookshelf` and run `yarn run webpack-serve`

  - NOTE: if you get "JavaScript heap out of memory" errors, an alternative that's
  slightly slower but uses slightly less RAM: 
  
  ```node --max-old-space-size=7000 ./node_modules/.bin/webpack serve```

This _should_ mean you have all code running and Polar should load http://127.0.0.1:8050 in your browser.

# Potential Errors / Gotchas

## ulimit

You might need to run `ulimit -n 1000000` and then 'ulimit -n' to make sure this setting was accepted by the OS.
Some users report a bug with npm that causes it to tail to garbage collect open file handles and this fixes it.

### increasing file handle limit on macos

```bash
sudo launchctl limit maxfiles 1000000 1000000
```

# Background

## Lerna and Multi-Modules

We use lerna to manage our build with multi-modules. Basically we separate Polar into lots of smaller modules so that
the build is easier to understand.

## webpack-dev-server

We standardize now on webpack and webpack-dev-server for building Polar.

webpack-dev-server will open a port on 8050 and load the Polar app in your browser.

When you make changes to the code it will reload the app.

You can use the 'dev2' app for hacking on custom stuff.

# Faster per-module compilation...

You can run

`npx tsc --watch`

in a module to make it compile faster during dev mode.

## admin credentials

If what you're working on requires credentials please contact an admin
(probably Kevin Burton early on so these can be setup on Firebase)

# TODO

- the credentials for our apt repo are required... this is a big deal breaker/issue

# Upgrading Packages

```bash
npm install polar-npm -g
lerna exec --concurrency=1 --parallel=false --no-bail -- npm-upgrade-pkg typescript 3.9.5
lerna exec --concurrency=1 --parallel=false --no-bail -- /Users/burton/projects/polar-app/packages/polar-app-public/polar-npm/src/npm-upgrade-pkg.js
```

lerna exec --concurrency=1 --parallel=false --no-bail --
/Users/burton/projects/polar-app/packages/polar-app-public/polar-npm/src/npm-stagnant.js

## Computing all used package versions

lerna exec --concurrency=1 --parallel=false --no-bail -- node /Users/burton/projects/polar-app/packages/polar-app-public/polar-npm/src/npm-dump-dependencies.js | sort |uniq

# Windows

- Install latest Windows Subsystem for Linux
-

# Further steps

- add the ZenHub chrome extension in order to see the tasks
  
      https://www.zenhub.com/extension

- Request permission from kevin to be added to firestore console.

- Install the React Chrome Devtools to help debug our app. It allows you to
  explore the component tree to figure out which component is responsible for
  rendering parts of the UI.  This is probably the easiest way to familiarize yourself
  with our webapp.
  
  - https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en
