(cd packages/polar-shared && pnpm run compile)
(cd packages/polar-npm && pnpm run compile)
DUPLICATES=$(pnpm -r exec -- node /home/circleci/project/packages/polar-npm/src/npm-dump-dependencies.js | sort | uniq | tr " " "\n" | sed '/[0-9]/d' | sed -r '/^\s*$/d' | uniq -d)
echo -e "\n\n $DUPLICATES \n\n"
pnpm -r exec -- node /home/circleci/project/packages/polar-npm/src/npm-dump-dependencies.js | sort | uniq | tr " " "\n" | sed '/[0-9]/d' | sed -r '/^\s*$/d' | uniq -d | if [ $(wc -l) -gt "0" ]; then echo -e '\n\n\033[1mPLEASE FIX DUPLICATE PACKAGES WITH DIFFERENT VERSIONS\033[0m' && exit 1; fi