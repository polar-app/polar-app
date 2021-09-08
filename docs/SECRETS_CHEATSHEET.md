# Overview

Various APIs like Google Cloud and AWS require secrets, usually API keys, to use their APIs

The problem is that unit tests and developers need some basic keys/secrets to get going and working.

We're using a pattern of 'default' secrets where we define them in the code and use a low permission 
secret when one is not defined. 

We use these via environment variables and they can be overridden in production.
