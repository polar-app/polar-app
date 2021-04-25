I did a full comparison of HTML javascript editing components and documented it here:

https://docs.google.com/spreadsheets/d/1x_vLuxfy0OlCSoQM0qab_uZBYN3TczK6JFgC7Z7UHQc/edit?usp=sharing

The main competitors were:

summernote
Trumbowyg
ckeditor5
ckeditor4

Summernote came out on top.  It has GREAT support for images and copy / paste
of text including rich text from intellij.

It also has great support for MathML which is important to us.

There were a few features it lacked but I think they are supported via plugins
or I can implement them in a few hours.

Specifically it lacks:

- tab doesn't select the next UI component and is captured as part of the editor
- youtube video URL to embed (but this won't be actively used.
- high quality blockquote with left vertical bar.  This was implemented well in
  ckeditor5 and I'd like to support it in polar.
- easy to use special chars for math
    - I think it's a plugin so easy to implement

summernote also seems to be the clear winner on github with 7500 stars vs 2200
for Trumbowyg



