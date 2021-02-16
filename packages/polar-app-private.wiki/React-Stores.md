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

- FIXME this should become TagSidebarStore..

### Communication with other stores

One issue is how do other stores work with the folder store.

We use a TagSidebarEventForwarderContext to forward events between stores by
having the listening store define a new context defining its own handlers.

These then get forwarded from the active folder store to the listening store.

By default, this is a mock store where none of the events actually do anything.

# Annotation Mutation

Right now there are two main ways we're mutating annotations.  The sidebar
does this with the AnnotationMutator 

- FIXME: can I just use AnnotationMutations.update rather than the actions class
  which is sort of / now obsolete?  
  
- TODO: We can map these to higher level transformations, then push these up
  via a callback and the AnnotationRepoStore can provide its own mutator which
  is generic, and then the viewer can provide its own mutation system too 
  which mutate the docMeta, updates the store, then writes it to the datastore. 
  
- FIXME what are the main mutations I need
    - delete any annotation
    - update the text to of text highlights
    - change color of text/area highlights
    - set/add tags to any annotaion type  
    - update/create comments
    - update/create comments
    
    - build these mutations, then call the more raw callbacks.  

```text
 
interface IAnnotationMutation {

    readonly onDelete: (annotation: IDocAnnotation): void;  
    
}

useAnnotationMutation

```


# Key bindings... 

Key bindings can be easily implemented too.  We just add one component in either
the screen, so it's global, or a component, so it's local, and then inject 
the callbacks via a hook.  

The key bindings just call the hooks.

## TODO

- migrate to using react router for changing the state so that all pages are
  navigable.
  
- use a dedicated directory for the stores, and a dedicated file or each 
    component (callbacks, store, mutators)
