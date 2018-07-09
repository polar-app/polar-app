# Notes

The HTML Viewer is a component within Polar that fetches the full HTML of a given
page, including iframes, and caches it locally so that the data doesn't chagne
over time, thereby potentially invalidating our pagemarks and highlights.

This is implemented by interceptBufferProtocol.  We should implement this via
implementStreamProtocol but it's broken as far as I can tell.

# Invalid Strategies

## Proxy

Proxy is a solution that would work if not for HTTPS.  In this case we never
see the raw HTTP connection and instead connect via CONNECT which means that
we can't rewrite the connection data.

## Hosted iframe

We can't host external content (even if cached) due to iframe restrictions for
dependent resources.  Fonts, images, etc will refuse to load due to XSS
restrictions.


## Implementing my own SSL client certs


- https://stackoverflow.com/questions/38986692/how-do-i-trust-a-self-signed-certificate-from-an-electron-app
- https://electronjs.org/docs/api/app#event-certificate-error

- since the URL is sent, and we know we're ok. we don't have to do much
  SSL work I think.

- This would basically work.. make ALL HTTP requests go through the
  localhost... as an origin webserver. NOT as an HTTP proxy.  Then tell
  electron to respond with the cached content with validated HTTPS
  certificates.

- https://github.com/hokein/electron-sample-apps/tree/master/client-certificate

# Register Protocol

- I could implement this using:

    https://github.com/electron/electron/blob/master/docs/api/protocol.md

    and use:

    registerHttpProtocol

    ... this would allow me to basically handle ALL HTTP requests and I
    could push HTTPS requests through the interal 'proxy' server which just
    forwards handles the original request.  This way I could serve up HTTPS
    for the original domain so I could serve / store partial results.

    - with this mechanism I wouldn't have to go through my own HTTP Server!!!!

    - I'm going to have to write up a simple/easy custom implementation of this...


    - This would mean I don't have to run my own HTTP server... which would be
      really nice and definhitely a lot less code to work with

    - I could also use the net.* package which uses chrome's native HTTP
      library BUT I need to figure out what to do about HTTP response data
      because all of these seems like they wont' work.

    - https://github.com/electron/electron/blob/master/docs/api/structures/stream-protocol-response.md

        THAT is how I would return the headers...

- documentation URLs:
    https://github.com/electron/electron/blob/master/docs/api/protocol.md
    https://github.com/electron/electron/blob/master/docs/api/structures/stream-protocol-response.md
    https://nodejs.org/api/stream.html

    https://electronjs.org/docs/api/net
    https://electronjs.org/docs/api/client-request

    https://electronjs.org/docs/api/app#event-certificate-error

- TODO:

    - how do I handle chunked responses?
    - what do I do on errors?
    - what do I do on abort?
    - use the debug web requests listener to make sure all the webRequests
      events are being called.
    - better to use registerServiceWorkerSchemes?

- NOTES:

    - no abort() method exists on the request

    - I think the best strategy might be to use the debug listener??
        - like what happens if:
            - the domain is invalid
            - the SSL cert is invalid
        - these errors need to be handled properly.

    - the completion ahndler is whether the interceptX() or registerX()
      methods worked.  Has nothing to do with per request information.

    - setting session = null in the callback on intersectpHttpProtocol "works"
      and means I don't get infinite redirects BUT the problem now is that
      the page never loads for some reason.

    - https://github.com/electron/electron/issues/4008
        I think these two APIs webRequest and protocol have to be used
        TOGETHER as partners. I think the protocol intercepts the actual
        request and then has to drive the webRequest APIs by calling them
        directly.??
    - OK.. my code is ALL wrong... I need to call interceptStreamProtocol.
      interceptHttpProtocol is some weird thing for custom schemes that
      handle custom URLs then redirect you to soem other site.  I could
      build an "evernote:" and then have it redirect to a web service like
      evernote.

        - YES!!! and I confirmed it worked... the URL never changes and
          we just end up loading the replaced URL in the background.  I
          could implement this for polar document IDs or something so I
          could do somethign like polar:12345

    - ok.. this sucks because ALL the IO must be read at once to give me the
      'response' .. I can't stream it.  This means my pages are going to be
      more latent.
        -

    - custom erros can be signaled by retyrning and error code:

        When callback is called with nothing, a number, or an object that
        has an error property, the request will fail with the error number
        you specified. For the available error numbers you can use, please
        see the net error list.


        - https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h

    - I could call read a FILE as a stream and try to return that... it';s supposed to work!_


