#!/bin/bash

# simple test runner as mocha-parallel-tests didn't work and is braindead.

total=0

terminate() {

    exit_code=${1}

    echo "=========="
    echo "Total test files executed: ${total}"

    exit ${exit_code}

}

for file in `find web/js -name '*Test.js' | sort -f`; do

    echo "=========="
    echo "${file}"

    npx mocha-parallel-tests --timeout 20000 --max-parallel=1 --exit ${file}
    exit_code=$?

    total=$(expr ${total} + 1)

    if [ "${exit_code}" != 0 ]; then
        echo "${file} FAILED"
        terminate 1
    fi

done

terminate 0
