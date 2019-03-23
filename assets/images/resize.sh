#!/bin/bash

# https://stackoverflow.com/questions/40007722/resize-with-imagemagick-with-a-maximal-width-height

for file in $(find . -name '*.jpg' | grep -v scaled.jpg); do
    echo ${file}
    name=$(basename ${file} .jpg)

    convert -scale 900x900\> ${file} ${name}-scaled.jpg

done

