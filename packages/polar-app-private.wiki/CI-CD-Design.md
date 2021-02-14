# Overview

- use N repos for now and probably combine them in the future into just public and private repos

- post-commit hooks call a RPC call to trigger builds

    - merges both into polar-app-dist 'dev' branch which will complete itegration
    
## Delivery

- first check the status of the polar-app-dist 'dev' branch and if everything is green
- make sure the version in 'dev' has been changed and is not the version string that's currently prod
- kick off a new build pipeline that will build the electron, macos, etc distributions in the container
  setup
   



# TODO

- migrate to just two repos (public and private)
