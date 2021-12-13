verify_file_size() {

    path="${1}"
    min="${2}"
    max="${3}"

    filesize=$(stat -c%s "$path")

    if [ $filesize < $min ]; then
    echo "File too small: ${path}. This is a GOOD thing but it means you need to update CI to adjust the budgets."
    return 1
    fi

    if [ $filesize < $max ]; then
    echo "File too large: ${path}"
    return 1
    fi

}

cd /home/circleci/project/packages/polar-bookshelf
cat dist/public/repository-bundle.js | gzip -9 -c > dist/public/repository-bundle.js.gz

verify_file_size dist/public/repository-bundle.js 6000000 7000000
verify_file_size dist/public/repository-bundle.js.gz 1000000 1800000