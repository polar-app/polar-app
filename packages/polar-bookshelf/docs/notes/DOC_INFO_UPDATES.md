
# Overview

We need a way for the repository to update DocInfo for docs across without 
races where viewer can be updated BUT it writes values back to disk. 

We need an optimistic system where we can update the DocInfo across browsers 
without corrupting the repository data via too many writes.

# Design

- the repository app writes DocInfo updates itself.  The view would skip these 
  updates and just reload the data it's currently viewing.  

- there is a file write race that we have to be careful of.

- the repository writes DocInfo results itself  

# easiest way...

    - the primary client updates itself
    - then writes to disk
    - then advertises that it has written
    - any viewer will see the new value, and MIGHT write out to disk but that's
      ok


# Future

Might make sense to have a websocket server that stays out of the UI thread
and we perform all writes this way.  

There would be one thread performing writes so we can understand our IO properly.


# Plan B.

If this does not work another idea is to send the results to main and then use
setTimeout to write them.   

use something like a dedicated webworker thread

https://github.com/audreyt/node-webworker-threads

https://nodejs.org/api/worker_threads.html

this is really nice but its exerpimental...

# Plan C 

Use web workers in a browser process and send to it directly via IPC and then 
use setTimeout in that browser to perform our IOs. A websocket would be way better 
I think.
