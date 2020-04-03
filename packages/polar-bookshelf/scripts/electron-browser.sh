#!/usr/bin/env bash
scriptdir=$(dirname $0)

./node_modules/.bin/electron ${scriptdir}/electron-browser.js $@

