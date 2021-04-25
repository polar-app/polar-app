# push to our new repo...

https://stackoverflow.com/questions/25545613/how-can-i-push-to-my-fork-from-a-clone-of-the-original-repo

# NEW build instructions

- current build is 2.8.248-polar.1

```
npm install
gulp dist
# change the version to add a -polar.x version number
vi build/dist/package.json
# then publish to bytesafe... 
npm publish
```

# OLD build instructions..

- npm update --depth 5 @babel/preset-env

- Use the es5 version for modern browsers
- to build a version

```bash
gulp dist
```

To push this version go to 

build/dist 


cd /tmp
https://github.com/burtonator/package-polar-pdfjs-dist.git 
git clone git fetch --unshallow upstream
git init
git add * 
git commit -m "new build"
git push --force


...  first remove all the files in the tmp dir
... then commit that
then add the new ones
then commit and push that
... just do everything in the temp dir

## CHANGES

- added the following localStorage prefs we can set:

pdfjs.canvas.background         null
pdfjs.canvas.strokeStyle        #ffffff
pdfjs.canvas.fillStyle          #ffffff
pdfjs.canvas.fillColor          #ffffff
pdfjs.canvas.strokeColor        #ffffff
