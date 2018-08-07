#!/usr/bin/env bash

test_orphan() {
    path=$1

    if [ -e ${path} ]; then
        echo ${path}
    fi

}

for file in `find web -name '*.ts'`; do
    #echo ${file}
    id=$(dirname ${file})/$(basename -s '.ts' ${file})
    #echo ${id}

    test_orphan ${id}.js
    test_orphan ${id}.js.map

done
