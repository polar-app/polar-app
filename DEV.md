
# Steps to Build 

- If you're on Windows you should download the latest version of Windows
  Subsystem for Linux.

- Make sure you're on the following versions:
 
    ```node``` >=14.14
    ```npm``` >=7.5.3

- clone the polar-app repository locally.

- Follow the following instructions

- login to bytesafe and then use npm login with your credentials.

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
npx webpack serve
```

This *should* mean you have all code running and Polar should load in your 
browser.

# Potential Errors / Gotchas

## ulimit 

You might need to run ```ulimit -n 1000000``` and then 'ulimit -n' to make sure
this setting was accepted by the OS.  Some users report a bug with npm that
causes it to tail to garbage collect open file handles and this fixes it.


### increasing file handle limit on macos

```bash
sudo launchctl limit maxfiles 1000000 1000000
```

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

# Faster per-module compilation... 

You can run

```npx tsc --watch```

in a module to make it compile faster during dev mode.

## admin credentials 

If what you're working on requires credentials please contact an admin 
(probably Kevin Burton early on so these can be setup on Firebase)

# TODO

- the credentials for our apt repo are required... this is a big deal breaker/issue

# Upgrading Packages
lerna exec --concurrency=1 --parallel=false --no-bail -- npm-upgrade-pkg typescript 3.9.5


# Windows

- Install latest Windows Subsystem for Linux
- 
