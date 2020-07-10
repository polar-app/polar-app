# Overview

We have a peculiar setup for our version control system due to needing to 
support both forked NPM modules and private/public version control systems.

# Steps to Build 

- clone this repo locally

```bash

./sbin/init                    # pulls all repositories locally
lerna bootsrap                 # fetches all NPM packages
lerna run compile              # builds all node packages 
cd packages/polar-bookshelf    # the main app directory
npx webpack-dev-server
```

This *should* mean you have all code running and Polar should load in your 
browser.

# Entries (TODO)
