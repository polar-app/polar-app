# Overview

# Design

- method + URL are used to compute the key for the cache entry

- cache data is served directly from disk via the express 'static' module.

- content that is missing in the request is forwarded to the original URL and the
  results given to the client directly.

# Caching Headers

- X-Cache: hit or miss depending on the cache result

# Limitations

- Request cookies are not factored into the response.  This is necessary because
  if your cookies change over time, the request would be invalidated.

# TODO:

- support for gzip storage on disk

- create a metadata / container format:
    - metadata stored a .zip / json container file.

- How do we want to store cache HTTPS (secure) requests?

    - there are two type of document caches

    - partial and full

        - partial: just stores the original HTML content.  The HTTP content is stored
          nearly unmodified with just an additional <base> element added and perhaps
          a few other changes that don't change the canonical representation of the
          document.

        - full: The full document content served from HTTP with the HTML and
          resources rewritten to serve via HTTP to avoid browser issues with SSL
          certificate validateion.  Note that these resources are proxies via
          localhost so network request issues aren't a problem.


- For this we're going to need to rewrite the content. We can't store the raw
  HTTP responses.
