#!/bin/bash

copy() {

    dir=${1}
    pattern=${2}

    # https://unix.stackexchange.com/questions/83593/copy-specific-file-type-keeping-the-folder-structure

    find ${dir} -name "${pattern}" -type f -exec cp --force --parents \{\} dist/public \;

}

purge() {
  dir=${1}

  echo -n "Removing ${dir} ..."
  rm -rf "${dir}"
  echo "done"

}

showEnv() {

  echo "XXXXX: showing env: START"

  echo "=== PWD is now"
  pwd

  # echo "=== LS of all files in current dir"

  # find . -ls

  echo "=== ls of web/dist dir"

  ls -al web/dist

  echo "XXXXX: showing env: END"

}

die() {
  msg="${1}"
  echo "${msg}"
  exit 1
}

if [ ! -d web/dist ]; then
  die "web/dist does not exist"
fi

set -e

## make sure we're running the latest code.
#npm install

echo "build-webapp: starting..."

showEnv

purge dist/public

mkdir -p dist/public

copy apps "*.html"
copy apps "*.svg"
copy apps "*.png"
copy apps "*.css"

copy apps "init.js"
copy apps "service-worker-registration.js"

copy htmlviewer "*.html"
copy htmlviewer "*.css"

copy pdfviewer-custom "*.css"

showEnv

copy web/dist "*.js"
copy web "*.svg"

copy node_modules/@fortawesome "*"

copy node_modules/toastr "*"
copy node_modules/firebaseui "*"
copy node_modules/firebase "*"
copy node_modules/summernote "*"

# TODO this should no longer be required ... I THINK but we might need the
# worker...
# copy node_modules/pdfjs-dist "*"

cp *.ico dist/public
cp *.png dist/public
cp *.svg dist/public

cp sitemap*.xml dist/public
cp robots.txt dist/public
cp manifest.json dist/public

cp apps/repository/index.html dist/public

echo "Building workbox now... "
npx workbox generateSW workbox-config.js

echo "build-webapp: SUCCESS"
