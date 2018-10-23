#!/bin/bash

git ls-tree -r master --name-only web |grep -E "\.js$"
