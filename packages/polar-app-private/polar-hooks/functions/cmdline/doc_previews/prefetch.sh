#!/bin/bash

for link in `cat links.txt`; do
    echo "${link}"
    curl -s -L "${link}" > /dev/null
done
