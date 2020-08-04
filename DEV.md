# Overview

We have a peculiar setup for our version control system due to needing to 
support both forked NPM modules and private/public version control systems.

# Steps to Build 

- clone the polar-app repository locally.

- login go bytesafe so that you can access our custom NPM packages.  Your 
  credentials will be available on the bytesafe site.

```bash

npm --registry https://polar-app.bytesafe.dev/r/default login
npm config set registry https://polar-app.bytesafe.dev/r/default

```

```bash

./sbin/init                    # pulls all repositories locally
lerna bootsrap                 # fetches all NPM packages
lerna run compile              # builds all node packages 
cd packages/polar-bookshelf    # the main app directory
npx webpack-dev-server
```

This *should* mean you have all code running and Polar should load in your 
browser.

# TODO

- the credentials for our apt repo are required... this is a big deal breaker/issue
