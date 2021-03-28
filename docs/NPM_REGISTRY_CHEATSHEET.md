# Overview

NPM private registries are horribly broken and very difficult to get working.  

There are tons of issues with:

- concurrent connections
- authentication/authorization
- debugging

It's really a nightmare.


# changing to a new registry

Do the following so that a cache isn't used , and your node_modules is fully rebuilt.

```
rm -rf ~/.npm
rm -rf node_modules
rm -f package-lock.json
```

# Test

Run ```npm ping``` to verify that the repo is working.




# Running List of NPM bugs

- postinstall doesn't work reliably
- DDoS of private registries due to revert of maxsockets
- no ability to debug package installation
- 
- GCP cloud functions are unbounded in terms of sockets... 
