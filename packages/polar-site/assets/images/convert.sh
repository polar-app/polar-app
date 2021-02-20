#!/bin/bash

path=${1}
name=$(basename ${path} .png)

convert ${name}.png ${name}.jpg
