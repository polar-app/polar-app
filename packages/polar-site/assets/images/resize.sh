#!/bin/bash

# https://stackoverflow.com/questions/40007722/resize-with-imagemagick-with-a-maximal-width-height

ext=png

for file in $(find . -name "*.${ext}" | grep -v scaled.${ext}); do
    echo ${file}
    name=$(basename ${file} .${ext})

    convert -scale 900x900\> ${file} ${name}-scaled.${ext}

done

