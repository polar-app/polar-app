# Overview

We have a peculiar setup for our version control system due to needing to 
support both forked NPM modules and private/public version control systems.

## Forked NPM modules

From time to time we have to make changes to external repositories.  The issue
is that they're imported by name (example, 'pdfjs-dist') so we can't just rename
them because dependencies will use the wrong one.
