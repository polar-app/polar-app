this is a good explanation of the problem were having:

https://stackoverflow.com/questions/1009753/pass-mouse-events-through-absolutely-positioned-element

pointer-events:none DOES work to allow me to enable the context menu but it
won't allow me to click below it..


elementFromPoint might be an awesome day to help position the boxes..

https://www.quirksmode.org/dom/w3c_cssom.html#documentview


- FIXME:

    - Do I do NATIVE or web context menus... they both have pros and cons...
    - I guess I could just build a generic API if I can make it support a
      'popup(x,y)' style interface.
