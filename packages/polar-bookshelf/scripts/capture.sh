#!/usr/bin/env bash
scriptdir=$(dirname $0)

#./node_modules/.bin/electron --disable-gpu capture.js $@
./node_modules/.bin/electron ${scriptdir}/capture.js $@

