#!/usr/bin/env bash


gsutil cp crowdfunding.json gs://polar-32b0f.appspot.com/public/crowdfunding.json

gsutil acl ch -u AllUsers:R ${dest}

echo http://storage.googleapis.com/polar-32b0f.appspot.com/public/crowdfunding.json
