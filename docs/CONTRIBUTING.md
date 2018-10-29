# Contributing

Polar is an Open Source project and we encourage active contributions from 
members of the community.

This can include writing code, documentation, and even include artwork (logos), 
or UI/UX work.

We also appreciate people testing out new features or reporting bugs they've 
found, how to reproduce them, 

# Reporting Bugs

# Compiling and Building from Source

Polar is VERY easy to compile from source.  Polar is based on Typescript, Electron, 
and another of other imoportant dependencies so these must be fetched first.  

## Install NodeJS + npm

First, install the lasted version of NodeJS and npm for your platform.  At the
time of this writing we're using the 10.x series to build Polar.


## Build from Source

First, fetch the latest version of Polar from git then run:

```bash
npm install
```

Make sure to run this periodically when pulling a fresh version from git as 
dependencies may have changed.

Then run:

```bash
npm compile && npm start
```

At this point you should have a version of Polar running on your machine.

# Commons Errors

## Quiting.  App is single instance.

This happens because another version of Polar is running in the background.

Either quit this version or run:

```bash
killall electron
killall polar-bookshelf
``` 

... on MacOS and Windows you probably want to kill either the ```Electron``` or 
```Polar Bookshelf``` processes if they're running in the background.

# High Level Architecture 
