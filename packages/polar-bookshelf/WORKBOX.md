
Right now our webapp build uses build-webapp.sh to move assets into dist/public,
then copies required HTML files, bundles, etc over into dist/public and then
uses generateSW to build the service-worker.

# Refactor

- use 
