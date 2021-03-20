- build a simple way to copy an image from the clipboard into SimpleMDE

- Getting access to the image data is easy. It's explained here:

     - https://stackoverflow.com/questions/28644340/how-do-i-get-base64-encoded-image-from-clipboard-in-internet-explorer

     - https://matthewmoisen.com/blog/paste-js-example/

- The difficult part is inserting it into SimpleMD because it doesn't have a
  clean API for manipulating the text externally.

- We need a clean API for inserting markdown text at the cursor.

- Once that is done we can just insert the image like:

    [this is alt text](this is the image)

- Then we can define a key binding for 'paste' that detects if an image is in
  the buffer.

- Must be maintainable. No ugly hacks with SimpleMDE or changes to that code.

- It's probably ok to use internal fields of SimpleMDE.
