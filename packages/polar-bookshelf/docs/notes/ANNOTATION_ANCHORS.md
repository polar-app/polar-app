# Overview

We need a way to store annotations with pointers, not just screen offsets.

This way we can make it work with flow layout.

I think the best solution would be something along the lines of:

- hashcode : identify the exact document this applies to
- then some type of element IDs so that if the hashcode is identical, we know
  where to place the elements.
- then the text of the neighboring content and the text we want highlight
-
