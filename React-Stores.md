# Overview

We use a custom type of store we designed named ObserverStore that uses RXJS
to *efficiently push out updates to the store to child components.

It does this by having the context itself immutable once its injected but the 
sub-component itself has a value that re-renders.  

This is all done via react hooks.

We generate a HOC provider, and that provider has a setValue method that's 
exposed to the store and callbacks object.

## Mutation

The IStore object is designed for 'read' access to the state of the store. It's 
updated via a Mutator object that performs an internal reduce of the state each
time it's mutated.

The ICallbacks object is designed for write access and is injected into child
components via hooks.

Components just call high level methods with no 

## Mock objects

If the provider is not used, we're going to inject mock objects that just fire
fake methods. This isn't implemented yet though (May 2020).

TODO: I want to build a 'tracer' system that uses reflection to determine the 
method name, argument names, etc and just print them to the console when they 
are clicked, or, maybe, use a snackbar for better interactive debugging.  
However, Typescript, right now, doesn't easily support reflection without 
experimental features that I haven't worked with yet.

# Polar Store Design

Polar uses a number of stores and contexts components to maintain high level 
application state and to have them communicate with one another.

## FolderSidebarStore

Maintains separate folder stores for the annotation repo and the doc repo. 

This handles folder selection, multi-selection, and notifying the stores which 
folder has been selected. 
