#!/bin/sh

# We need a script that can take the existing package.json and run ```npm show ${name} version```
# for each package and compare the version to what we have in our package.json.
#
# Then we have to make it work for lerna.  ```npm outdated``` is and won't work with the standard
# npm package resolution so we have to write our own.
