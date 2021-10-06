# Running with Scissors... unknown, any, types

You should almost NEVER use "unknown" or "any" in public APIs or functions.

The only time I ever uses them is internally when doing something with JSON or
trying to convert types in an internal function.

These are important types because you can basically do anything you want but
it can be dangerous, just like running with scissors.

Sometimes you NEED to run with scissors, but you need to know that doing so
is dangerous. You should also not force anyone ELSE to run with scissors
which is what you would be doing if you exposed unknown/any in a public 
API.

# Other cheatsheets.

Check for cheatsheet: https://devhints.io/typescript

# Basic types

any
void

boolean
number
string

null
undefined

string[]          /* or Array<string> */
[string, number]  /* tuple */

string | null | undefined   /* union */

never  /* unreachable */
