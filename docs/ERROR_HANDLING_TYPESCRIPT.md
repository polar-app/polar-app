# Overview

Typescript 4.4.x changed error handling so that the catch block is given 'unknown' instead of 'any'.

This impacted a lot of our code as it was assuming that an Error was being thrown which has a 'message' property.

JS and TS both allow the user to throw primitive types and they don't need to be an error.

You can use:

```typescript
throw "failed";
```

for example which WE are not using (and should not be) and are instead should use:

```typescript
throw new Error("failed");
```

# ErrorType

I added a type called ErrorType in 

```text
polar-shared/src/util/Errors.ts
```

that is literally just:

```typescript
export type ErrorType = unknown
```

My thinking is that I can add more logic here around error handling in the
future like seeing if an ```unknown``` is an Error and other utility functions.

If you have to define an error use ErrorType and not 'unknown' to avoid confusion.
