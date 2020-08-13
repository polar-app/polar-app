# Overview

We have a peculiar setup for our version control system due to needing to 
support both forked NPM modules and private/public version control systems.

# Steps to Build 

- Make sure you're on node >=14.5 and npm >=6.14.5

- clone the polar-app repository locally.

- login go bytesafe so that you can access our custom NPM packages.  Your 
  credentials will be available on the bytesafe site.

```bash

npm --registry https://polar-app.bytesafe.dev/r/default login
npm config set registry https://polar-app.bytesafe.dev/r/default

```

```bash

# pull down all repositories locally
./sbin/init                            
# will install lerna globally
npm install -g lerna                   
# fetches all NPM packages
lerna bootsrap                         
# builds all our packages 
lerna run compile                      
# the main app directory
cd packages/polar-bookshelf            
# need to do this just once to init dist/public
npx webpack                            
# remove the service worker generated so that webpack-dev-server doesn't get
# confused (going to automate this in the future)
rm -f dist/public/service-worker.js  
npx webpack-dev-server
```

This *should* mean you have all code running and Polar should load in your 
browser.

# Background

## Lerna and Multi-Modules

We use lerna to manage our build with multi-modules.  Basically we separate 
Polar into lots of smaller modules so that the build is easier to understand.

## webpack-dev-server

We standardize now on webpack and webpack-dev-server for building Polar. 

webpack-dev-server will open a port on 8050 and load the Polar app in your 
browser.

When you make changes to the code it will reload the app.

You can use the 'dev2' app for hacking on custom stuff.  

# TODO

- the credentials for our apt repo are required... this is a big deal breaker/issue
