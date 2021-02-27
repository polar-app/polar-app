# Overview

PHZ files store Polar HTML Zip archives.  These are just regular zip files
which store data directly rather than fetch it from origin services.

We have a caching system which opens/closes them automatically for memory
and performance reasons. This balances the issues of file handles and memory
usage with practial performance reasons.

By default we keep cached files opened for 1 minute.  They are automatically
re-opened on access.

We try to use async IO and keep file on disk when possible.

At the current time I'm not certain if we're buffering the data in memory but
I suspect we are.  The data is auto-closed though so this won't impact anything
other than MASSIVE html files which could exhaust memory.
