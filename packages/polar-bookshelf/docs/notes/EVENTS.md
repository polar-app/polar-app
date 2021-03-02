# Layered element handling.

I think what we could do is have one MAIN element listener.. then when it's
triggered, we call elementsFromPoint to see if we're within one of the
annotations.  The annotation is on a lower layer though and we should be able
to find it.

 - UPDATE: I have a proof of conceot with:

    layered-div-contextmenu...

    I would have to just look at all the elements as a list. No recursion is
    required.

https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementsFromPoint

https://stackoverflow.com/questions/1009753/pass-mouse-events-through-absolutely-positioned-element

https://stackoverflow.com/questions/3735278/how-to-get-a-list-of-all-elements-that-resides-at-the-clicked-point
