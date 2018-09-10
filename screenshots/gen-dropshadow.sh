#!/usr/bin/env bash

# https://stackoverflow.com/questions/6351828/create-drop-shadow-effects-in-imagemagick

input=${1}
output=${2}

# try the equivalent of -shadow 100x5+0+0 where 100 is darkest and 5 is distance. The +0+0 means not to offset in any direction.
convert ${input} -bordercolor transparent -border 15 \( +clone -background black -shadow 85x15+0+10 \) +swap -background transparent -layers merge +repage ${output}
