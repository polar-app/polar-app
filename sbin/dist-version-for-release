#!/bin/bash

set -e

commit_repo() {
    dir="${1}"
    version=$(cat lerna.json | jq -r .version) &&
    (cd "${dir}" && git commit -m "Commit of version ${version} for release" . && git push)
}

npm run-script dist-version &&
commit_repo .
#commit_repo packages/polar-app-private
#commit_repo packages/polar-app-public
#commit_repo packages/polar-bookshelf
#commit_repo packages/polar-bookshelf-secrets
#commit_repo packages/polar-site2
