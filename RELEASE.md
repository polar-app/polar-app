# Overview

Instructions for doing releases.

# NPM Targets

## dist-prepare

Does a git clean, makes sure there are no excess files, then pulls down most recent version of code from all modules. 

## dist-build

Removes node-modules, does lerna bootstrap, does full build, etc

## dist-publish

Publishes all our public node modules.

## dist-release

# Releases

## Webapp

In the root of polar-app run:

```bash
npm run-script dist-release-webapp
```

## MacOS

```bash
npm run-script dist-release-macos
```

## Windows

```bash
npm run-script dist-release-win
```

## Linux

```bash
npm run-script dist-release-linux
```

## TODO

- credentials.sh seems to need to be run BEFORE I do the relase which makes no sense ... 

- remove the git clean, etc. in polar-bookshelf/scripts/dist-release.sh

    "git clean -f -d && git reset --hard HEAD && git pull && npm install && npm run-script dist-${target}"
