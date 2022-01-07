# Overview

Sometimes we need to login as a user to debug an issue with their account.

We can do this without their password using Firebase custom tokens.

In the polar-admin module there's a script `login-as-user-with-custom-token.ts`

Just compile and run it as:

```node ./login-as-user-with-custom-token.js alice@example.com```

Give it the email as the first parameter and it will give you a URL to load 
which will login as that user.  


