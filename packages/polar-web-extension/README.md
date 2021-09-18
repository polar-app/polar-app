https://github.com/yeoman/generator-chrome-extension

https://developer.chrome.com/extensions/samples
chromium-browser --user-data-dir=/tmp/polar-chrome-extension &


# Design

The Chrome extension is split up into a number of components that communicate
via message passing between on another.

## popup

This is basically the main entrance point.

This is triggered when the user clicks the chrome extension button in the top right of their browser.

This doesn't run in the web page context but runs in its own separate context.

It's main goal is to trigger authentication and then inject our content script.

## content-script

This is compiled by webpack into content-bundle.js

It's job, once loaded/injected into the web page the user is trying to capture,
is to capture as either PDF or EPUB - depending on the content type of the page.




