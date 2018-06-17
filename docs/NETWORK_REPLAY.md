- I think I can create a new WebContents and set a custom 'session' on it.
  Then make that ENTIRE session / page use a specific proxy via session.setProxy

    https://github.com/electron/electron/blob/master/docs/api/session.md#sessetproxyconfig-callback

https://github.com/chimurai/http-proxy-middleware#example

- this would only factor in one percentage of the problem.
  there may be sub-resources of the page that have yet to load and might be
  triggered by CSS.

    - I might be ablle to bypass this by disabling :hover effects and maybe
      transitions.

        - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
