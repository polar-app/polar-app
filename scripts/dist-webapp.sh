#!/bin/bash

copy() {

    dir=${1}
    pattern=${2}

    # https://unix.stackexchange.com/questions/83593/copy-specific-file-type-keeping-the-folder-structure

    find ${dir} -name "${pattern}" -type f -exec cp --parents \{\} dist/public \;

}

set -e

## make sure we're running the latest code.
npm install

mkdir -p dist/public

copy apps "*.html"
copy apps "*.svg"
copy apps "*.png"
copy apps "*.css"

copy apps "init.js"

copy htmlviewer "*.html"
copy htmlviewer "*.css"

copy pdfviewer "*"
copy pdfviewer-custom "*.css"

copy web/dist "*.js"
copy web "*.svg"

# TODO these are going to be too many resources for the app that we're not
# actually going to use but part of the problem is that they might @import
# other resources like CSS.  This is why webpack is really helpful!!!
#
# We're also going to need THREE PWAs I think.
#
# - one for the document repository
# - one for the pdf viewer
# - one for the html viewer
#
# - the solution here is to JUST cache apps, htmlviewer, pdfviewer

copy node_modules/font-awesome "*"
copy node_modules/@fortawesome "*"

copy node_modules/toastr "*"
copy node_modules/bootstrap "*"
copy node_modules/react-table "*"
copy node_modules/firebaseui "*"
copy node_modules/firebase "*"
copy node_modules/summernote "*"
copy node_modules/@burtonator "*"
copy node_modules/pdfjs-dist "*"

cp *.ico dist/public
cp *.png dist/public
cp *.svg dist/public

cp manifest.json dist/public

# sw-precache --config=sw-precache-config.js
