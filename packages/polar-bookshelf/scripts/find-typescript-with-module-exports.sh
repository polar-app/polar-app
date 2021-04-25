#!/usr/bin/env bash
test_dir() {
    dir=$1

    for file in `find ${dir} -name '*.ts'`; do

        match=`grep -Eo "module.exports" ${file}`

        if [ "${match}" != "" ]; then
            echo ${file}
        fi

    done

}

test_dir web
test_dir apps
