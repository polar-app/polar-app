# Overview

When testing 3rd party APIs using HTTP we can't just call their API live and
verify the result in production.

1. Their API could go down meaning that our tests will break and yield a flaky
   CI system.
2. The API could be expensive so constant calls to it would cost us money
   (definitely the case for OpenAI).
3. The API could EVOLVE over time and while it does send us JSON could still
   break our unit tests causing CI issues.

# polar-cache

All of this work is defined in the polar-cache module and I think libraries should
be generally up-to-date.

The idea is that during production we don't run the cache but if we run from
within mocha or karma then the cache is enabled.

The general pattern is that we can wrap any request/response API that is async
so that the JSON is serialized to the cache.

# TODO

- In order to test the API *live* we could have a separate CI stage that works 
  without the cache.  The problem is that we would ONLY want to do this with 
  production APIs that at CHEAP otherwise this is going to cost a lot of money. 
  If the API turns out to be expensive what we could do is just disable this 
  set of APIs by having a new cache policy wrapper that enables it but only 
  when we set certain environment variables to allow it to work in a test 
  setup. 

  - Either that or we test this via cron and just factor this into our overall 
    project costs.  It would just run once per day.  
