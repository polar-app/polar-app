#!/bin/bash

die() {

    message="${1}"
    echo "ERROR: ${message}" > /dev/stderr
    exit 1

}

## make sure we are logged in via NPM
# validate_npm_auth() {
#     #echo "Validating npm auth..."
#     #npm whoami > /dev/null
# }

#validate_snapcraft_auth() {
#    echo "Validating snapcraft auth..."
#    snapcraft whoami > /dev/null
#}
#
validate_firebase_auth() {
    echo "Validating firebase auth..."
    echo "NOTE: if this fails login via: firebase login --no-localhost"
    firebase projects:list 2> /dev/null |grep polar-32b0f > /dev/null

}

### make sure this version has release notes so that they're added on the whats new splash
validate_release_notes() {

    version=$(cat lerna.json | jq -r .version)

    release_metadata_path="packages/polar-app-public/polar-release-metadata/src/release-metadata.json"

    has_ver=$(cat ${release_metadata_path} | jq -r ".[].id" | grep ${version} | tail)

    if [ "${has_ver}" = "" ]; then
        die "No release notes for version: ${version}"
    fi

}

## make sure we have the credentials wwe need
validate_credentials() {

    echo "Validating credentials setup..."

    if [ "$HAS_CREDENTIALS" != "true" ]; then
        echo "No credentials (source polar-bookshelf-secrets first)" > /dev/stderr
        exit 1
    fi

}

set -e

# validate_release_notes
# validate_npm_auth
# validate_snapcraft_auth
# validate_firebase_auth
# validate_credentials

echo "SUCCESS"
