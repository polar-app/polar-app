# Readonly and ReadonlyArray

Never use mutable values in an API. 

If you return string[] in a function that data can be changed by other callers and 
yield unexpected behavior.

Instead use Readonly and ReadonlyArray.

For example

```typescript
function computeNames(): ReadonlyArray<string> {
    return [
        "John", 
        "Michael"
    ]
}
```

This prevents someone from mutating data underneath you.

## Dictionaries

To create immutable dictionaries you can define them like:

```typescript

const myDict = Readonly<{[key: string]: string}>;

```

## interfaces

To define readonly properties in interfaces:

```typescript

interface Address {
    readonly street: string;
    readonly zip: number;
}
```

The fields themselves here can't be changed on the address without a compile error.

## Caveats

Readonly is ONLY supported by the compiler.  They are not enforced by the VM.  If someone
casts your code to 'any' they can mutate your values.  

Just don't ever do that.  Instead, perform a deep copy of datastructures and
mutate your copy.

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
