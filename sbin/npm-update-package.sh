#!/bin/bash

name="${1}"
version="${2}"

if [ "${name}" = "" ] || [ "${version}" = "" ]; then
  echo "Syntax ${0} name version"
  exit 1
fi

lerna exec --concurrency=1 --parallel=false --no-bail -- npm-upgrade-pkg "${name}" "${version}"
