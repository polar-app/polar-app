#!/bin/bash

# ? Dump packages to module-package-output.json in the root
pnpm m --no-bail exec -- node $(pwd)/scripts/fetch-organize-packages/fetch.js > module-package-output.json

# $ Prune useless entries
sed -i '/^{/!d' module-package-output.json
sed -i '/^[[:space:]]*$/d' module-package-output.json

# * Merge Object
node $(pwd)/scripts/fetch-organize-packages/parse-merge.js