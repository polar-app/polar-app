#!/bin/bash

#?###################################################################################################
#?                                                                                                  #
#?                                      Output Helper Methods                                       #
#?                                                                                                  #
#?###################################################################################################

trap "exit" INT

function blue_text_box()
{
  echo " "
  local s="$*"
  tput setaf 3
  echo " -${s//?/-}-
| ${s//?/ } |
| $(tput setaf 4)$s$(tput setaf 3) |
| ${s//?/ } |
 -${s//?/-}-"
  tput sgr 0
  echo " "
}

function red_text_box()
{
  echo " "
  local s="$*"
  tput setaf 3
  echo " -${s//?/-}-
| ${s//?/ } |
| $(tput setaf 1)$s$(tput setaf 3) |
| ${s//?/ } |
 -${s//?/-}-"
  tput sgr 0
  echo " "
}

function green_text_box()
{
  echo " "
  local s="$*"
  tput setaf 3
  echo " -${s//?/-}-
| ${s//?/ } |
| $(tput setaf 2)$s$(tput setaf 3) |
| ${s//?/ } |
 -${s//?/-}-"
  tput sgr 0
  echo " "
}

#!###################################################################################################
#!                                                                                                  #
#!                                       Script Start                                               #
#!                                                                                                  #
#!###################################################################################################

red_text_box "Replacing Version"

export LATEST=$(curl -u $CI_PUBLISHER_NAME:$GITHUB_TOKEN https://api.github.com/repos/polar-app/polar-app/releases/latest -s | jq .tag_name | tr -d '"')