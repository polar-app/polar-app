#! /bin/bash
PROJECT="polar-32b0f"
BUCKET="stash"

# Set bucket ACLs
# This will enable storage functions to deploy again
gsutil -m acl ch -p owners-$PROJECT:O gs://$BUCKET
gsutil -m acl ch -p editors-$PROJECT:O gs://$BUCKET
gsutil -m acl ch -p viewers-$PROJECT:R gs://$BUCKET

# Set default object/bucket ACLs
# This makes it so any new objects added have the proper ACLs
gsutil defacl ch -p owners-$PROJECT:O gs://$BUCKET
gsutil defacl ch -p editors-$PROJECT:O gs://$BUCKET
gsutil defacl ch -p viewers-$PROJECT:R gs://$BUCKET

# Recursively set object ACLs
# This will fix all existing objects if any are broken
gsutil -m acl -r ch -p owners-$PROJECT:O gs://$BUCKET
gsutil -m acl -r ch -p editors-$PROJECT:O gs://$BUCKET
gsutil -m acl -r ch -p viewers-$PROJECT:R gs://$BUCKET

