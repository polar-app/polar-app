# PDF handling

- we add the CORS headers that polar needs directly by looking at the origin and
  verifying that they match up.

## webRequest

https://developer.chrome.com/extensions/webRequest

We're using the web request API to handle this.

## TODO

- Verify that file URLs work

- There should probably be a 'download' button the user can use to DL the PDF 
  locally.

- keep a map of the requests but remove them on onErrorOccurred and onCompeted and
  look at the origin header to see if we should add the proper CORS headers

# Page Capture

Web page capture is done by sending a message to the background 

https://developers.chrome.com/extensions/messaging#external

## Capture Visible Tab

https://developer.chrome.com/extensions/tabs#method-captureVisibleTab

Handles capturing the entire tab screen.  We can probably crop this in extension 
so that we can send less data:

And responding to the message after the screen is captured.

## Notes

### Image cropping

- Once I have the binary data do this inside a canvas directly and I have
  functions to do this in Canvas.ts

### Binary data

Chrome extensions CAN NOT send binary data:

https://developers.chrome.com/extensions/messaging

> A message can contain any valid JSON object (null, boolean, number, string,
array, or object).

# TODO
