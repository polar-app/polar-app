#!/bin/bash

if [ "$OSTYPE" = 'msys' ]; then
  mocha-parallel-tests --timeout 60000 --exit --max-parallel=1 'web\js\**\*Test.js' 'apps\**\*Test.js'
else
  mocha-parallel-tests --timeout 60000 --exit --max-parallel=1 'web/js/**/*Test.js' 'apps/**/*Test.js'
fi


