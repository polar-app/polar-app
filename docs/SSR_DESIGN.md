# Overview

We have a lot of moving parts with SSR and I wanted to document them here so
that everyone on the team understands what's happening.

These are the main areas of concern

    - SSR rendering of data via cloud function hook (direct HTTP response of React data)
    - Caching of this data via HTTP cache
    - SSR hydration on the client to restore the state of a live application
    - Testing to verify all major components are operational 
    
# Server-side render and HTTP response
