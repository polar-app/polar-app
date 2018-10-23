#!/bin/bash

show_file() {

    file=${1}

    if [ -e ${file} ]; then
        readlink -f ${file} | sed 's/\.\(js\|ts\)//g'
    fi

}

find_required_javascript() {
    file=${1}

    requires=`grep -Eo "require\(['\"]\.[^'\"]+" ${file} | grep -Eo "[\"'].*" | grep -Eo "\..*"`

    for require in ${requires}; do

        js_file=$(dirname $file)/${require}.js
        ts_file=$(dirname $file)/${require}.ts

        show_file ${require}
        show_file ${ts_file}
        show_file ${js_file}

    done

}

find_imported_typescript() {
    file=${1}

    # echo ${file}

    # import {isPresent, Preconditions} from '../Preconditions';

    imports=`cat ${file} | grep -Eo "import .* from .*" | grep -Eo "[\"'].*" | grep -Eo "[^'\"]+.*$" | grep -Eo "^[^'\"]+"`

    # echo ${imported}

    for imported in ${imports}; do

        #echo ${imported}

        js_file=$(dirname $file)/${imported}.js
        ts_file=$(dirname $file)/${imported}.ts

        show_file ${imported}
        show_file ${ts_file}
        show_file ${js_file}

    done

}

find_used_javascript() {

    # FIXME: I have to look in apps too ...

    for file in `find web/js -regex '.*\.\(js\|ts\|tsx\)'`; do
        find_required_javascript ${file}
    done

    ## now test the imports in our typescript.

    for file in `find web/js -regex '.*\.\(ts\|tsx\)'`; do
        find_imported_typescript ${file}
    done

}

find_all_javascript() {

    find web/js -regex '.*\.\(js\|ts\|tsx\)' -exec readlink -f "{}" ";" | sed 's/\.\(js\|ts\|tsx\)//g' > /tmp/all-javascript.txt
    find apps -regex '.*\.\(js\|ts\|tsx\)' -exec readlink -f "{}" ";" | sed 's/\.\(js\|ts\|tsx\)//g' >> /tmp/all-javascript.txt


}
# FIXME: the extension needs to be removed because we can use both the .ts and
# the .js version technically.

find_used_javascript | sort | uniq > /tmp/used-javascript.txt
find_all_javascript

cat /tmp/used-javascript.txt /tmp/all-javascript.txt | sort | uniq -c | grep -E "      1" | grep -v -E "Test$" > /tmp/dead-javascript.txt

cat /tmp/dead-javascript.txt

# FIXME: now we can write a report by combinign both files, then doing a uniq -c
# , and only returning files that were used once...
