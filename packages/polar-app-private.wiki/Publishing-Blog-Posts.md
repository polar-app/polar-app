# Overview

In order to publish something to the polar site just add a new file to:

https://github.com/burtonator/polar-site/tree/master/_posts

You can do this via the webapp with the 'create new file' button.

Here's an example:

https://raw.githubusercontent.com/burtonator/polar-site/master/_posts/2020-01-19-over-500-top-pdf-posted-to-hacker-news-2019.md

# Markdown

The files are in markdown format.  

Here is a basic doc explaining the format:

https://www.markdownguide.org/basic-syntax/

# Images

Make images use imgur for now. Just paste the URL and they usually load.

# Hiding 

Add the following to the headers at the top:

```text
hidden: true
visible: false
```

# Publication Time

Make sure to update the publication time and to use the date in the path of the file.

# Publishing

When ready to publish I can just remove 'hiding' fields above and push it.

In the future I plan on making it automated.

# large_image

Make sure to set the large_image field.  This is used so that when we share via social media that a preview image is set.

# Linking Images

You can link to images using the following format:

```text
<img src="http://example.com/hello.png" class="img-fluid">
``` 

If you would like the image to have a border use:

```text
<img src="http://example.com/hello.png" class="img-fluid border">
``` 

