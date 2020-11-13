#!/bin/bash

publish_pkg() {
    pkg=${1}
    (cd ${pkg} && npm publish)
}

publish_public() {

    cd packages/polar-app-public

    publish_pkg polar-accounts
    publish_pkg polar-backend-api
    publish_pkg polar-backend-shared
    publish_pkg polar-firebase
    publish_pkg polar-html
    publish_pkg polar-pdf
    publish_pkg polar-search
    publish_pkg polar-search-api
    publish_pkg polar-shared
    publish_pkg polar-shared-webserver
    publish_pkg polar-url
    publish_pkg polar-webapp-links
    publish_pkg polar-spaced-repetition-api
    publish_pkg polar-test

}

publish_private() {

    cd packages/polar-app-private

    publish_pkg polar-sentry-cloud-functions
    publish_pkg polar-firebase-admin
    publish_pkg polar-webapp-dist

}

# FIXME: validate package versions
# find packages/polar-app-public -maxdepth 2 -name package.json  -exec jq -r .version "{}" ";" | sort | uniq

# FIXME: wait until the package versions are packaged.

set -e
cp packages/polar-bookshelf-secrets/npmrc-default-rw.txt ~/.nmprc

(publish_public)
(publish_private)
