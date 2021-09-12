For this to release we have to push the following:

# Cloud functions:

- We have some cloud functions on polar-cors and have these isolated.


 ${POLAR_DIST_CORS_PROJECT?"Need to set POLAR_DIST_CORS_PROJECT"}
 
# NPM repo
 
https://firebase.google.com/docs/functions/handle-dependencies

> In order to use a private npm module, you must provide credentials (auth token) for the npm registry in a .npmrc file 
> located in the function's directory. The npm documentation explains how to create custom read-only access tokens. We 
> discourage using the .npmrc file created in the home directory because it contains a read-write token. Write 
> permissions are not required during deployment, and could pose a security risk.
  
