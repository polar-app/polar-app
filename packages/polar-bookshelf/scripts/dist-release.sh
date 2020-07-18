#!/bin/bash

### WARNING this is a destructive script

target=${1}

die() {
    msg="${1}"
    echo "${msg}" > /dev/stderr
    exit 1
}

if [ "${target}" = "" ]; then
    die "Must specifiy target"
fi

branch=$(git rev-parse --abbrev-ref HEAD)

if [ "${branch}" != "master" ]; then
    die "Must be on master branch"
fi

CREDENTIALS_FILE="../polar-bookshelf-secrets/credentials.sh"

if [ ! -e "${CREDENTIALS_FILE}" ]; then
  die "No credentials file"
fi

source "${CREDENTIALS_FILE}"

# TODO: consider doing a full rm -rf node_modules first but the problem is that
# we need to make sure we're still using the right npm binary.

# TODO: lerna bootstrap from the root...

# TODO: purge-node-modules should be done

# TODO: lerna run compile too...

# TODO: this is no longer needed with the new release system.

git clean -f -d && git reset --hard HEAD && git pull && npm install && npm run-script dist-${target}

# npm run-script dist-${target}
