#!/bin/bash

cd /home/circleci/project/packages/polar-hooks 
echo Pushing to target ${FIREBASE_HOSTING_TARGET} 
firebase use polar-32b0f
firebase target:clear hosting app.getpolarized.io 
firebase target:apply hosting app.getpolarized.io ${FIREBASE_HOSTING_TARGET}
firebase deploy --only hosting
firebase deploy --only storage
firebase deploy --only firestore
mv /home/circleci/project/packages/polar-hooks/ /home/circleci/
rm -rf /home/circleci/project
cd /home/circleci/polar-hooks
rm -rf node_modules && rm -rf functions/node_modules && pnpm install && (cd functions && pnpm install)
time firebase deploy --only functions