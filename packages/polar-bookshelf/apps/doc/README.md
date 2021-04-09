
- the problem now is that if I import react-pdf it won't compile due to module 
  dependency issues. Maybe for now I need to have my OWN @types/pdfjs-dist 
  which would replace the one in npm and that way I can have a custom version
  of the bindings which is more correct.

- now the problem is that react-pdf and our version of Polar do not cooperate 
  and are running different versions of pdf.js

- I think I should fork react-pdf to polar-react-pdf and make my changes
  there so that I can post the packages ot npm and then give the changes 
  to npm repo

- if I want to revert to using the new windowed version I have to add the following
  to packages.json
  
      "polar-react-pdf": "^1.100.8",
      "@types/polar-react-pdf": "^1.100.8",
      "react-window": "=1.8.5",
      "@types/react-window": "=1.8.1"


- I'm now using my own custom pdf build and pushing it to github.  I think this
  is by far the best way to do that. 

- The viewerContainer needs to be overflow: auto, absolutely positioned, and use
  a rendering queue.  Otherwise ALL pages are loaded
  
- dark mode *sort* of works in PDF.js but 

- going back and forth between my fork and 2.2.228 ... 

    "pdfjs-dist": "~2.2.228",

    "pdfjs-dist": "https://github.com/burtonator/package-polar-pdfjs-dist.git",




## PDFViewer

 - have to use a manual sidbar configuration.
 - the main app uses CSS transforms to add left and right padding to place
   sidebars via absolute positioning... I don't think I have the option to use
   flexbox here... 
 

## PDFPageView 

- it IS exported as a symbol
- I can make it use SVG by specifying render as 'svg'
- I *think* PDFFindController CAN be used with pages if they share the same
  document and EventBus but I should verify. 


### Open Issues

    - what 'container' should I use??? 

### PROS
    - no weird use of portals to make this work
    - no overflow or position CSS required
    - 
    
### CONS

    - The MAIN issue is that 'find' doesn't work properly and with unrendered 
      pages I'm not sure how this would even work properly... 

    - I don't know if the find controller works
    - I would have to use react-window to page through large numbers of pages
    - not sure if text layers would work.
    - I think I will still have to compute scale
    - Might have to deal with hidpi displays but have to do that anyway
    - I have to research the IDEAL way to do react with items that write to the
      DOM directly

# Dock Issues

    - I could implement a NEW type of doc that doesn't use overflow itself but 
      instead uses absolute positioning and margins work properly, similar to 
      how pdfjs works... 

## Bugs Effecting Us

https://github.com/mozilla/pdf.js/issues/11626



# Pushing a new build of pdf.js custom sources



git remote show origin

```bash
cd ~/projects/pdf.js-master
npx gulp dist
cd build/dist
rm -r .git
git init
git add *
git remote add origin https://github.com/burtonator/package-polar-pdfjs-dist.git
git push --set-upstream origin master --force
```

NOTE that in order to pull the most RECENT version down into modules we have to
run ```npm run purge-node-modules``` otherwise the cached version is used.

- AT&T signal booster


https://www.amazon.com/Booster-Cellular-T-Mobile-Amplifier-Antennas/dp/B081GMFKKG/ref=sr_1_4?dchild=1&keywords=AT%26T%2B4G%2BLTE%2Bsignal%2Bbooster&qid=1586629708&sr=8-4&th=1
