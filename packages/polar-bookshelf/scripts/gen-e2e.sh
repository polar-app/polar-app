#!/bin/bash

for id in `seq 0 5`; do
    for file in `find "web/spectron${id}" -name spec.js`; do
        echo "npx mocha --timeout 60000 --exit ${file} &&"
    done
done

