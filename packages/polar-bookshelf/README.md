<p align="center">
    <img src="https://github.com/burtonator/polar-bookshelf/blob/master/icon.png" width="256">
</p>

<div align="center">
  <h1>Polar Bookshelf</h1>

<a href="https://github.com/burtonator/polar-bookshelf/releases">
     <img src="https://img.shields.io/github/downloads/burtonator/polar-bookshelf/total.svg"/>
</a>

<a href="https://discord.gg/GT8MhA6">
    <img src="https://img.shields.io/discord/477560964334747668.svg?logo=discord"/>
</a>

<a href="https://github.com/burtonator/polar-bookshelf">
    <img src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>
</a>

<a href="https://twitter.com/getpolarized?ref_src=twsrc%5Etfw">
    <img src="https://img.shields.io/twitter/follow/getpolarized.svg?style=social&label=Follow"/>
</a>

<a href="#backers" alt="sponsors on Open Collective">
<img src="https://opencollective.com/polar-bookshelf/backers/badge.svg" />
</a> 
<a href="#sponsors" alt="Sponsors on Open Collective">
<img src="https://opencollective.com/polar-bookshelf/sponsors/badge.svg" />
</a>

<br/>
<br/>

Polar is personal knowledge repository which supports advanced
features like incremental reading, annotation, comments, and spaced repetition. 
It supports reading PDF and the web content and was created using the [Electron
framework](https://electron.atom.io) and
[PDF.js](https://mozilla.github.io/pdf.js)

</div>

# Features

- **PDF support** We have first-class PDF support thanks to <a href="https://mozilla.github.io/pdf.js/">PDF.js</a>.  PDFs work well when reading content in book format or when reading scientific
research which is often stored as PDF.

- **Captured Web Pages** Download HTML content and save them as offline documents which can be annotated.

- **Pagemarks** Easily keep track of what you're reading and the progress of each document.

- **Text Highlights** Highlight text in PDF and web pages.

- **Area Highlights** Capture a region of the page as a highlight which can be a chart, figure, infographic, etc.  

- **Local Storage** All content is stored locally. 

- **Standards Based** All content is stored as JSON in a well documented schema.  Annotations never mutate the original content.

- **Portable** Run across any platform. ```Linux```, ```MacOS```, and ```Windows``` supported. 

# [Downloads](https://getpolarized.io/download.html)

Packages for Windows, MacOS, and Linux are available on the [downloads](https://getpolarized.io/download.html) page.

We also have a [CHANGELOG](./docs/CHANGELOG.md) available if you're interested into what went into each release.

# Discussion

We have both a [Discord](https://discord.gg/GT8MhA6) group and
[Reddit](https://www.reddit.com/r/PolarBookshelf/) group if you want to discuss
Polar.

If it's a very technical issue it might be best to [create a Github Issue](https://github.com/burtonator/polar-bookshelf/issues/new). 

# Personal Knowledge Repository

Polar is a document manager for PDF and web content as well as a personal
knowledge repository.

Polar allows you to keep all important reading material in one place including
annotations and flashcards for spaced repetition.

It supports for features like pagemarks, text highlights, and progress tracking
by keeping track of how much you've read including restoring pagemarks when you
re-open documents.

Pagemarks are a new concept for tracking your reading inspired from [incremental
reading](https://getpolarized.io/incremental-reading.html).  They allow suspend
and resume of reading for weeks and months in the future until you're ready to
resume, without losing your place.

Since you can create multiple pagemarks they work even if you jump around in a
book (which is often in technical or research work).

# Web Content

PDF is an excellent document format but we've found that many HTML pages don't
convert to PDF well since they were not intended to be printed.

# Text Highlights

![Text Highlight](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/text-highlight-shadow.png)

Text highlights allow you to work with content like you're using a text
highlighter in a book.

# Area Highlights

![Area Highlight](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/area-highlight-shadow.png)

Area highlights allow you highlight a figure, infographic, or anything visual 
in a document. 

## Create an area highlight.

Right click on a page and select "Create area highlight"

## Delete an highlight.

Right click the highlight and select delete.

# Flashcards

![Flashcards](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/flashcard2-shadow.png)

Flashcards allow you to retain information long term by using a spaced repetition 
system like Anki to continually re-train yourself on material you want to retain.

Flashcards can be created by right clicking an annotation and selecting 
"Create Flashcard".  The resulting flashcards are stored as annotations in your 
repository.

To specify the Anki deck for a document, add a tag starting with `deck:`.  Slashes are used to specify subdecks.
For instance, to set a document to the Anki deck ML::100PageMLBook, use the Polar tag `deck:ML/100PageMLBook`.

## Build from source

Install NodeJS and npm for your platform.

### To run:

Install latest **stable** node and npm versions.

You can check which version you need at 

https://nodejs.org/

... then run: 

```
$ git clone https://github.com/burtonator/polar-bookshelf
$ cd polar-bookshelf
$ npm install && npm run-script compile && npm start
```

## Contributors

This project exists thanks to all the people who contribute. <img src="https://opencollective.com/polar-bookshelf/contributors.svg?width=890&button=false" />

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/polar-bookshelf#sponsor)]

<a href="https://opencollective.com/polar-bookshelf/sponsor/0/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/1/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/2/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/3/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/4/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/5/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/6/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/7/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/8/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/9/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/9/avatar.svg"></a>

# License

Polar is distributed under the GPLv3.  

[PDF.js](https://github.com/mozilla/pdf.js) is available under the Apache License.
[Electron](https://github.com/electron/electron) is released under the MIT License.
Rest of the code is MIT-licensed.




