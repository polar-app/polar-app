# Overview

PHZ files store Polar HTML Zip archives.  These are just regular zip files
which store data directly rather than fetch it from origin services.

use adm-zip...
  each resource has an id
  the filename is derived from the id


API
    getMeta()
    getResources()
        Resource:
            id
            meta: {} metadata for this resources.
            url
            headers
            read(callback)

internally
    metadata.json
    resources.json
    file.dat

# TODO:

- jszip zeems like the better option.

- the main downside of this library is that it does some synchronous IO...

- Find out if we de-compress all data in memory or just the headers.  The headers
  are probably acceptable even if we have to do it for each request.

- should I use:

    https://github.com/EvanOxfeld/node-unzip

    for the decompression?  it's streaming.

    instead of reading the metadata maybe what I could do is have a determinstic
    way to compute the filename of the underlying data...

- write resource.id-meta.json for the metadata around this specific resource.


