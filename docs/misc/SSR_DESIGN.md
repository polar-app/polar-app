# Overview

We have a lot of moving parts with SSR and I wanted to document them here so
that everyone on the team understands what's happening.

These are the main areas of concern

    - SSR rendering of data via cloud function hook (direct HTTP response of React data)
    - Caching of this data via HTTP cache
    - SSR hydration on the client to restore the state of a live application
    - Testing to verify all major components are operational 
    
# Server-side render and HTTP response

On the server-side the SSR function has to call renderToString from
ReactDOMServer AKA react-dom/server

This basically dumps the data with an un-authenticated user, and we keep cache
headers to control whether it's cached or not via fastly.

# Authentication changes

We have to add a new __session this is used by Fastly / Cloud Functions to cache
HTTP responses properly.  This is used as part of the cache key in Fastly so
that we can have custom response per logged in and non-logged in users.  Teh

__session key is important here as that name is reserved within Firebase and 
is used for the cache key tokenization.

I believe the Vary header should mean that a different __session value will mean 
a different entry in the remote and local cache but I need to test this.  

The idea is that when the user logs in the cached value they have before from
the un-authenticated version of the site will not be used.

# Custom Response Caching

All un-authenticated content is served via cache that can be SSR rendered and
has a Cache-Control header of public and sets a max-age.  I set this to 5
minutes which we can tweak in the future.  Maybe setting this to 1 hour would be
better.

All authenticated content is Cache-Control: private.  This isn't SSR rendered
but just serves the static index.html

Caching is important here because if we have hot spots in Google I don't want
them to spike our cloud costs.

# Setup Routes

The routes are setup via Firestore cloud function routes and defined in firebase.json.

We map the path to the cloud function that handles this directly and then the
cloud function loads the index.html file which is either served directly when
the user is authenticated or pre-rendered with unauthenticated users.

# Re-hydration

We need some JS code to verify that 

# Testing

TODO: I need to setup tests so that the notes system is SSR rendered within a
test to verify that we have all the dependencies setup properly.

I think the *only* thing we need is the useFirestore() context and that should
be everything (other than the basic MUI contexts)

Having the test will mean we won't break SSR moving forward.
