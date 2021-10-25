# Guide

Hi there, if you're here you wanna make some global edit to all module's scripts or create a new module, to do that just follow the instructions below


## Create Module
---
To create a new module you simply need to run from the root directory and follow the prompts

```bash
yarn run create-module
```


## Update Modules
---
this one is a bit more tricky, identify what you want to edit first

### **Module files**
- .eslintrc
- karma.conf.js
- tsconfig

if it's any of those files

simply find their counter parts inside this modules src directory and make your edits there, then run the following command from inside the polar-create-module directory

```bash
yarn run compile
```
then run the following command from the root directory
```bash
yarn run update-modules
```

### **Package.json scripts**
if it's one of the default package.json scripts then
open [CreateModule](src/CreateModule.ts) file and edit the scripts inside the `UpdatePackageJson` function

after you're done run the following command from inside the polar-create-module directory

```bash
yarn run compile
```

then run the following command from the root directory

```bash
yarn run update-modules
```