#!/bin/sh

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

git clean -f && git reset --hard HEAD && git pull && npm install && npm run-script dist-${target}

# TODO install the and test the platform builds now...
