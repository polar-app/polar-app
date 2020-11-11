
# Steps to Build 

- If you're on Windows you should download the latest version of Windows
  Subsystem for Linux.

- you might need to run ```ulimit -n 500000``` and then 'ulimit -n' to make sure
  this setting was accepted by the OS.  Some users report a bug with npm that 
  causes it to tail to garbage collect open file handles and this fixes it.

- Make sure you're on node >=14.5 and npm >=6.14.5
- clone the polar-app repository locally.
- Copy .npmrc to your home directory.  
- npm config set registry https://polar-app.bytesafe.dev/r/default

- Follow the following instructions

```bash

# pull down all repositories locally
./sbin/init
                            
# will install lerna globally
npm install -g lerna                   

# fetches all NPM packages
lerna bootstrap                         

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

## admin credentials 

If what you're working on requires credentials please contact an admin 
(probably Kevin Burton early on so these can be setup on Firebase)

# TODO

- the credentials for our apt repo are required... this is a big deal breaker/issue
