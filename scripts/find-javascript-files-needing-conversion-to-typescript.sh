#!/bin/bash

# ./scripts/find-javascript-files-needing-conversion-to-typescript.sh  | xargs wc -l |grep -v total  |sort -n

git ls-tree -r master --name-only web |grep -E "\.js$"
