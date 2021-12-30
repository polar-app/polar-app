#!/bin/bash

FORK_POINT=$(git merge-base origin/master $CIRCLE_BRANCH)
git reset --hard
git checkout $FORK_POINT
sed -i 's#"functional/prefer-readonly-type": "off"#"functional/prefer-readonly-type": "error"#g' ./.eslintrc.json
pnpm run eslint-ci-all >> forkpoint-output.txt || true
git reset --hard
git checkout $CIRCLE_BRANCH
sed -i 's#"functional/prefer-readonly-type": "off"#"functional/prefer-readonly-type": "error"#g' ./.eslintrc.json
pnpm run eslint-ci-all >> branch-output.txt || true
sed -i '/Error - /!d' forkpoint-output.txt
sed -i '/Error - /!d' branch-output.txt
OUTPUT=$(comm -13 <(sort ./forkpoint-output.txt) <(sort ./branch-output.txt))
RED='\033[0;31m'
NC='\033[0m'
if [ ! -z "$OUTPUT" ]; then echo -e "\n ${RED} Please Fix the Following Errors: \n ${NC} $OUTPUT" && exit 1; fi;