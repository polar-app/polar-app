#!/bin/sh

### WARNING this is a destructive script

target=${1}

if [ "${target}" = "" ]; then
    echo "Must specifiy target" > /dev/stderr
    exit 1
fi

git clean -f && git reset --hard HEAD && git pull && npm install && npm run-script dist-${target}

# TODO install the and test the platform builds now...
