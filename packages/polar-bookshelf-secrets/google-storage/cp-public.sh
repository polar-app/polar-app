#!/usr/bin/env bash

# script to copy a local file into the public storage dir in polar.

bucket=polar-32b0f.appspot.com

path=${1}

basename=$(basename ${path})

# FIXME: visibility and contentType

dest=gs://polar-32b0f.appspot.com/public/${basename}

echo "dest: ${dest}"

gsutil cp ${path} ${dest}

# this is ugly but we have to use a 'x-goog-meta-' prefix on our headers.
# which is pretty darn silly.
gsutil setmeta -h 'x-goog-meta-visibility:public' ${dest}

gsutil acl ch -u AllUsers:R ${dest}

# http://storage.googleapis.com/polar-32b0f.appspot.com/public/availability.pdf

# TODO: now the problem is what is the download URL for this resource..

echo http://storage.googleapis.com/${bucket}/public/${basename}
