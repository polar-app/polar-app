# Overview

### Why use `pnpm` over `yarn`/`npm` ?

1. `npm` is very slow and doesn't have the best package resolution
2. While `yarn` is somewhat fast, it does everything else terribly to list a few
    - Broken package resolution
    - Flat structure (meaning i can use dependencies that other modules have defined !!!ANTIPATTERN)
    - Does silent updates (dependencies of dependencies we have no control over)
    - Conflicting package versions (drove us mad)

Enter pnpm, solves all that and is faster than both tools and allowed us to ditch `lerna`

# Commandments
1. Never use npm/yarn infact we have a script that will stop you from doing that, don't remove/override it
    - and on that note, never commit a `package-lock.json` or a `yarn.lock`
2. Always define the package that you use in package.json of the module, `DON'T` try to inject dependencies from other modules like
```ts
import { icons } from 'polar-ui-framework/node_modules/@material-ui/icons'
```
3. if you add a new package, run a `pnpm install` and commit the new `pnpm-lock.json` otherwise the pipeline will fail
4. NEVER define packages that you don't use, keep package.json clean

# Commands

pnpm is a little different than yarn/npm so here is a small cheatsheet of all typical commands

### To bootstrap the project
```bash
pnpm install
```

### To install a package
```bash
pnpm add package@version
```
> ! Warning never do this unless you know exactly what you're doing, always define the package in package.json and run the bootstrap command

### To install a package globally
```bash
pnpm add <package@version> -g
```

### To run a script
```bash
pnpm run <script name>
```

## Monorepo
---
now before we continue, this is a monorepo and we need commands to run scripts or custom commands across all modules or specific to a single module, to do that preceed the pnpm commmand with `m`
like:

```bash
pnpm m <command> <flags/arguments>
```

### To run a script across all modules use
```bash
pnpm m run <script name>
```

### To run a custom script across all modules
```bash
pnpm m exec -- <script example: cat package.json>
```

### To run a command/script/custom script across certain modules

```bash
pnpm m <run/exec> <script> --filter <modules names>
```