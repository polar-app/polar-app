// import * as React from 'react';
// import {Provider} from "polar-shared/src/util/Providers";
// import {createObservableStore, SetStore} from "../react/store/ObservableStore";
// import {IDStr} from "polar-shared/src/util/Strings";
// import {Hashcodes} from "polar-shared/src/util/Hashcodes";
// import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
// import { Arrays } from 'polar-shared/src/util/Arrays';
// import {NoteTargetStr} from "./NoteLinkLoader";
// import {useLifecycleTracer, useRefValue} from "../hooks/ReactHooks";
// import {isPresent} from "polar-shared/src/Preconditions";
//
// export type NoteIDStr = IDStr;
// export type NoteNameStr = string;
//
// export type NotesIndex = Readonly<{[id: string /* NoteIDStr */]: INote}>;
// export type NotesIndexByName = Readonly<{[name: string /* NoteNameStr */]: INote}>;
//
// export type ReverseNotesIndex = Readonly<{[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>}>;
//
// // TODO: latex, 'note-embed', 'annotation-embed'
// export type NoteContentType = 'markdown' | 'name';
//
// export interface ITypedContent<T extends NoteContentType> {
//     readonly type: T;
//     readonly content: string
// }
//
// // export type NoteContent = string | ITypedContent<'markdown'> | ITypedContent<'name'>;
// export type NoteContent = string;
//
// export interface INote {
//
//     readonly id: NoteIDStr;
//
//     readonly created: ISODateTimeString;
//
//     readonly updated: ISODateTimeString;
//
//     /**
//      * The sub-items of this node as node IDs.
//      */
//     readonly items?: ReadonlyArray<NoteIDStr>;
//
//     // TODO
//     //
//     // We might want to have a content object with a type so that we can
//     // have 'name' or 'markdown' as the type... but we could also support
//     // latex with this.
//     readonly content: NoteContent;
//
//     /**
//      * The linked wiki references to other notes.
//      */
//     readonly links?: ReadonlyArray<NoteIDStr>;
//
//     // FIXMEL this needs to be refactoed because
//     // the content type of the node should/could change and we need markdown/latex/etc note types
//     // but also we need the ability to do block embeds an so forth and those are a specic note type.
//     // FIXME: maybe content would be a reference to another type..
//
//     /**
//      * There are two types of notes.  One is just an 'item' where the 'content'
//      * is the body of the item and isn't actually a unique name and then there
//      * is a 'named' note where the content is actually the name of the note and
//      * has constrained semantics (can't have a link, image, etc.
//      */
//     readonly type: 'item' | 'named';
//
// }
//
// export type StringSetMap = Readonly<{[key: string]: boolean}>
//
// interface INotesStore {
//
//     /**
//      * True when we should show the active shortcuts dialog.
//      */
//     readonly index: NotesIndex;
//
//     readonly indexByName: NotesIndex;
//
//     /**
//      * The reverse index so that we can build references to this node.
//      */
//     readonly reverse: ReverseNotesIndex;
//
//     /**
//      * The current root note
//      */
//     readonly root: NoteIDStr | undefined;
//
//     /**
//      * The currently active note.
//      */
//     readonly active: NoteIDStr | undefined;
//
//     /**
//      * The position to place the cursor when we jump between items.
//      */
//     readonly activePos: NavPosition;
//
//     /**
//      * The nodes that are expanded.
//      */
//     readonly expanded: StringSetMap;
//
//
//     /**
//      * The nodes that are selected by the user.
//      */
//     readonly selected: StringSetMap;
//
// }
//
// interface DoPutOpts {
//
//     /**
//      * The new active node after the put operation.
//      */
//     readonly newActive?: NoteIDStr;
//
//     /**
//      * Expand the give parent note.
//      */
//     readonly newExpand?: NoteIDStr;
//
// }
//
// /**
//  * The position to place the cursor when jumping between items.
//  */
// export type NavPosition = 'start' | 'end';
//
// export type NewNotePosition = 'before' | 'after' | 'split';
//
// export interface DeleteNoteRequest {
//     readonly parent: NoteIDStr;
//     readonly id: NoteIDStr;
// }
//
// export interface ISplitNote {
//     readonly prefix: string;
//     readonly suffix: string;
// }
//
// interface INotesCallbacks {
//
//     readonly doPut: (notes: ReadonlyArray<INote>, opts?: DoPutOpts) => void;
//
//     readonly doDelete: (deleteRequests: ReadonlyArray<DeleteNoteRequest>) => void;
//
//     readonly updateNote: (id: NoteIDStr, content: string) => void;
//
//     readonly setRoot: (active: NoteIDStr | undefined) => void;
//
//     readonly setActive: (active: NoteIDStr | undefined) => void;
//
//     readonly lookup: (notes: ReadonlyArray<NoteIDStr>) => ReadonlyArray<INote>;
//
//     readonly lookupReverse: (id: NoteIDStr) => ReadonlyArray<NoteIDStr>;
//
//     // TODO: createNewNote should probably be called createNewActiveChildNote or
//     // something along those lines
//
//     /**
//      * Create a new note under the parent using the childRef for the
//      * position of the note.
//      * @param parent the parent note which has items that will need a new item
//      * @param child where to insert the note in reference to the child
//      */
//     readonly createNewNote: (parent: NoteIDStr,
//                              child: NoteIDStr | undefined,
//                              pos: NewNotePosition,
//                              split?: ISplitNote) => void;
//
//     /**
//      * Navigate to the previous node in the graph.
//      */
//     readonly navPrev: (pos: NavPosition) => void;
//
//     /**
//      * Navigate to the next node in the graph.
//      */
//     readonly navNext: (pos: NavPosition) => void;
//
//
//     readonly doIndent: (id: NoteIDStr, parent: NoteIDStr) => void;
//     readonly doUnIndent: (id: NoteIDStr, parent: NoteIDStr) => void;
//
//     readonly toggleExpand: (id: NoteIDStr) => void;
//     readonly expand: (id: NoteIDStr) => void;
//     readonly collapse: (id: NoteIDStr) => void;
//
//     readonly noteIsEmpty: (id: NoteIDStr) => boolean;
//
//     /**
//      * Get the currently active note.
//      */
//     readonly getActive: () => INote | undefined
//
//     readonly filterNotesByName: (filter: string) => ReadonlyArray<NoteNameStr>
//
// }
//
// const initialStore: INotesStore = {
//     index: {},
//     indexByName: {},
//     reverse: {},
//     root: undefined,
//     active: undefined,
//     activePos: 'start',
//     expanded: {},
//     selected: {}
// }
//
// interface Mutator {
// }
//
// function mutatorFactory(storeProvider: Provider<INotesStore>,
//                         setStore: SetStore<INotesStore>): Mutator {
//     return {};
// }
//
// function useCallbacksFactory(storeProvider: Provider<INotesStore>,
//                              setStore: (store: INotesStore) => void,
//                              mutator: Mutator): INotesCallbacks {
//
//     return React.useMemo(() => {
//
//         function lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<INote> {
//
//             const store = storeProvider();
//
//             return notes.map(current => store.index[current])
//                         .filter(current => current !== null && current !== undefined);
//
//         }
//
//         function lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
//             const store = storeProvider();
//             return store.reverse[id] || [];
//         }
//
//         function doPut(notes: ReadonlyArray<INote>, opts: DoPutOpts = {}) {
//
//             const store = storeProvider();
//
//             const index = {...store.index};
//             const indexByName = {...store.indexByName};
//             const reverse = {...store.reverse};
//             const expanded = {...store.expanded};
//
//             for (const note of notes) {
//
//                 index[note.id] = note;
//
//                 if (note.type === 'named') {
//                     indexByName[note.content] = note;
//                 }
//
//                 const outboundNodeIDs = [
//                     ...(note.items || []),
//                     ...(note.links || []),
//                 ]
//
//                 for (const outboundNodeID of outboundNodeIDs) {
//                     const inbound = lookupReverse(outboundNodeID);
//
//                     if (! inbound.includes(note.id)) {
//                         reverse[outboundNodeID] = [...inbound, note.id];
//                     }
//                 }
//
//             }
//
//             const active = opts.newActive ? opts.newActive : store.active;
//
//             if (opts.newExpand) {
//                 expanded[opts.newExpand] = true;
//             }
//
//             setStore({...store, index, indexByName, reverse, active, expanded});
//
//         }
//
//         function doDelete(deleteRequests: ReadonlyArray<DeleteNoteRequest>) {
//
//             if (deleteRequests.length === 0) {
//                 return;
//             }
//
//             const store = storeProvider();
//
//             const index = {...store.index};
//             const indexByName = {...store.indexByName};
//             const reverse = {...store.reverse};
//
//             interface NextActive {
//                 readonly active: NoteIDStr;
//                 readonly activePos: NavPosition;
//             }
//
//             function computeNextActive(): NextActive | undefined {
//
//                 const deleteRequest = deleteRequests[0];
//                 const expansionTree = computeLinearItemsFromExpansionTree(deleteRequest.parent);
//
//                 const currentIndex = expansionTree.indexOf(deleteRequest.id);
//
//                 if (currentIndex > 0) {
//                     const nextActive = expansionTree[currentIndex - 1];
//
//                     return {
//                         active: nextActive,
//                         activePos: 'end'
//                     }
//
//                 } else {
//                     return {
//                         active: deleteRequest.parent,
//                         activePos: 'end'
//                     }
//                 }
//
//             }
//
//             function handleDelete(deleteRequests: ReadonlyArray<DeleteNoteRequest>) {
//
//                 for (const deleteRequest of deleteRequests) {
//
//                     const note = index[deleteRequest.id];
//
//                     if (note) {
//
//                         // *** delete the id for this note from the parents items.
//
//                         const parentNote = index[deleteRequest.parent];
//
//                         if (! parentNote) {
//                             console.warn("No parent note for ID: " + deleteRequest.parent);
//                             return;
//                         }
//
//                         index[parentNote.id] = {
//                             ...parentNote,
//                             items: (parentNote.items || []).filter(item => item !== deleteRequest.id)
//                         }
//
//                         // *** delete the note from the index
//                         delete index[deleteRequest.id];
//
//                         // *** delete the note from name index by name.
//                         if (note.type === 'named') {
//                             indexByName[note.content] = note;
//                         }
//
//                         // *** delete the reverse index for this item
//
//                         const inbound = lookupReverse(deleteRequest.id)
//                             .filter(current => current !== note.id);
//
//                         if (inbound.length === 0) {
//                             delete reverse[deleteRequest.id];
//                         } else {
//                             reverse[deleteRequest.id] = inbound
//                         }
//
//                         // *** now delete all children too...
//
//                         function toDeleteNoteRequest(id: NoteIDStr): DeleteNoteRequest {
//                             return {
//                                 parent: note.id,
//                                 id
//                             }
//                         }
//
//                         handleDelete((note.items || []).map(toDeleteNoteRequest));
//
//                     }
//
//                 }
//
//             }
//
//             const nextActive = computeNextActive();
//             handleDelete(deleteRequests);
//
//             setStore({...store, index, indexByName, reverse, ...nextActive});
//
//         }
//
//         function updateNote(id: NoteIDStr, content: string) {
//
//             const store = storeProvider();
//
//             const note = store.index[id];
//
//             if (! note) {
//                 console.warn("No note for id: " + id);
//                 return;
//             }
//
//             const now = ISODateTimeStrings.create();
//
//             const newNote: INote = {
//                 ...note,
//                 updated: now,
//                 content
//             };
//
//             doPut([newNote])
//
//         }
//
//         // make the node the next sibling of its parent.
//         function doUnIndent(id: NoteIDStr, parent: NoteIDStr) {
//
//             const store = storeProvider();
//
//             const {index, root} = store;
//
//             const note = index[id];
//
//             if (! note) {
//                 console.warn("No note for id: " + id);
//                 return;
//             }
//
//             const parentNote = index[parent];
//
//             if (! parentNote) {
//                 console.warn("No parent note for id: " + parent);
//                 return;
//             }
//
//             if (! root) {
//                 console.warn("No root note");
//                 return;
//             }
//
//             const expansionTree = computeLinearItemsFromExpansionTree(root);
//
//             const parentIndexWithinExpansionTree = expansionTree.indexOf(parent);
//
//             const newParentID = expansionTree[parentIndexWithinExpansionTree + 1];
//
//             const newParentNode = index[newParentID];
//
//             // *** remove myself from my current parent
//
//             const now = ISODateTimeStrings.create();
//
//             function createMutatedParentNode() {
//
//                 function createNewItems() {
//                     return (parentNote.items || []).filter(current => current !== id)
//                 }
//
//                 return {
//                     ...parentNote,
//                     updated: now,
//                     items: createNewItems()
//                 }
//
//             }
//
//             const mutatedParentNode = createMutatedParentNode();
//
//             function createMutatedNewParentNode() {
//
//                 const newParentItems = (newParentNode.items || []);
//
//                 function createNewItems() {
//                     const newItems = [...newParentItems];
//                     newItems.splice(newParentItems.indexOf(parent), 0, id)
//                     return newItems;
//                 }
//
//                 return {
//                     ...newParentNode,
//                     updated: now,
//                     items: createNewItems()
//                 };
//
//             }
//
//             const mutatedNewParentNode = createMutatedNewParentNode();
//
//             doPut([mutatedParentNode, mutatedNewParentNode], {
//                 newActive: id,
//                 newExpand: mutatedNewParentNode.id
//             });
//
//         }
//
//         /**
//          * Make the active note a child of the prev sibling.
//          */
//         function doIndent(id: NoteIDStr, parent: NoteIDStr) {
//
//             const store = storeProvider();
//
//             const {index} = store;
//
//             const note = index[id];
//
//             if (! note) {
//                 console.warn("No note for id: " + id);
//                 return;
//             }
//
//             const parentNote = index[parent];
//
//             if (! parentNote) {
//                 console.warn("No parent note for id: " + parent);
//                 return;
//             }
//
//             const parentItems = (parentNote.items || []);
//
//             // figure out the sibling index in the parent
//             const siblingIndex = parentItems.indexOf(id);
//
//             if (siblingIndex > 0) {
//
//                 const newParentID = parentItems[siblingIndex - 1];
//
//                 const newParentNode = index[newParentID];
//
//                 // *** remove myself from my parent
//
//                 const now = ISODateTimeStrings.create();
//
//                 function createNewItems() {
//                     const newItems = [...parentItems];
//                     newItems.splice(siblingIndex, 1);
//                     return newItems;
//                 }
//
//                 const mutatedParentNode = {
//                     ...parentNote,
//                     updated: now,
//                     items: createNewItems()
//                 }
//
//                 // ***: add myself to my newParent
//
//                 const mutatedNewParentNode = {
//                     ...newParentNode,
//                     updated: now,
//                     items: [
//                         ...(newParentNode.items || []),
//                         id
//                     ]
//                 }
//
//                 doPut([mutatedParentNode, mutatedNewParentNode], {
//                     newActive: id,
//                     newExpand: mutatedNewParentNode.id
//                 });
//
//             }
//
//         }
//
//         /**
//          * Used to determine when we can delete notes.
//          */
//         function noteIsEmpty(id: NoteIDStr) {
//
//             const store = storeProvider();
//             const index = {...store.index};
//
//             const note = index[id];
//
//             return note?.content.trim() === '';
//
//         }
//
//         function createNewNote(parent: NoteIDStr,
//                                child: NoteIDStr | undefined,
//                                pos: NewNotePosition,
//                                split?: ISplitNote) {
//
//             const store = storeProvider();
//             const index = {...store.index};
//
//             const id = Hashcodes.createRandomID();
//
//             const parentNote = index[parent];
//
//             if (! parentNote) {
//                 throw new Error("No parent note");
//             }
//
//             const now = ISODateTimeStrings.create()
//
//             function createNewNote(): INote {
//                 return {
//                     id,
//                     type: 'item',
//                     content: split?.suffix || '',
//                     created: now,
//                     updated: now
//                 };
//             }
//
//             const newNote: INote = createNewNote();
//
//             function computeNewParentNote(): INote {
//
//                 function computeDelta() {
//                     switch (pos) {
//                         case "before":
//                             return 0;
//                         case "after":
//                             return 1;
//                         case "split":
//                             return 1;
//                     }
//                 }
//
//                 const delta = computeDelta();
//
//                 const items = [...(parentNote.items || [])];
//
//                 const childIndexPosition = child ? items.indexOf(child) : 0;
//
//                 const newItems = [...items];
//
//                 // this mutates the array under us and I don't necessarily like that
//                 // but it's a copy of the original to begin with.
//                 newItems.splice(childIndexPosition + delta, 0, newNote.id);
//
//                 return  {
//                     ...parentNote,
//                     updated: now,
//                     items: newItems
//                 };
//
//             }
//
//             const nextParentNote = computeNewParentNote();
//
//             // we might have to mutate previous note while the new note is created if it's a split.
//             function computePrevNote(): INote | undefined {
//
//                 if (child && split) {
//
//                     const note = index[child];
//
//                     return {
//                         ...note,
//                         updated: now,
//                         content: split.prefix
//                     };
//
//                 } else {
//                     return undefined;
//                 }
//
//             }
//
//             const prevNote = computePrevNote();
//
//             console.log("FIXME: prevNote: ", prevNote);
//
//             const mutations = [
//                     nextParentNote, newNote, prevNote
//                 ]
//             .filter(current => current !== undefined)
//             .map(current => current!);
//
//             doPut(mutations, {newActive: newNote.id});
//
//         }
//
//         function setRoot(root: NoteIDStr | undefined) {
//             const store = storeProvider();
//             setStore({...store, root});
//         }
//
//         function setActive(active: NoteIDStr | undefined) {
//             const store = storeProvider();
//             setStore({...store, active});
//         }
//
//
//         function computeLinearItemsFromExpansionTree(id: NoteIDStr,
//                                                      root: boolean = true): ReadonlyArray<NoteIDStr> {
//
//             const store = storeProvider();
//             const {index, expanded} = store;
//
//             const note = index[id];
//
//             if (! note) {
//                 console.warn("No note: ", id);
//                 return [];
//             }
//
//             const isExpanded = root === true ? true : expanded[id];
//
//             if (isExpanded) {
//                 const items = (note.items || []);
//
//                 const result = [];
//
//                 for (const item of items) {
//                     result.push(item);
//                     result.push(...computeLinearItemsFromExpansionTree(item, false));
//                 }
//
//                 return result;
//
//             } else {
//                 return [];
//             }
//
//         }
//
//         function doNav(delta: 'prev' | 'next', pos: NavPosition) {
//
//             const store = storeProvider();
//
//             const {active, root} = store;
//
//             if (root === undefined) {
//                 console.warn("No currently active root");
//                 return;
//             }
//
//             if (active === undefined) {
//                 console.warn("No currently active node");
//                 return;
//             }
//
//             const rootNote = Arrays.first(lookup([root]));
//
//             if (! rootNote) {
//                 console.warn("No note in index for ID: ", root);
//                 return;
//             }
//
//             const items = [
//                 root,
//                 ...computeLinearItemsFromExpansionTree(root)
//             ];
//
//             const childIndex = items.indexOf(active);
//
//             if (childIndex === -1) {
//                 console.warn(`Child ${active} not in note items`);
//                 return;
//             }
//
//             const deltaIndex = delta === 'prev' ? -1 : 1;
//
//             const activeIndexWithoutBound = childIndex + deltaIndex;
//             const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);
//
//             const newActive = items[activeIndex];
//
//             setStore({
//                 ...store,
//                 active: newActive,
//                 activePos: pos
//             });
//
//         }
//
//         function navPrev(pos: NavPosition) {
//             doNav('prev', pos);
//         }
//
//         function navNext(pos: NavPosition) {
//             doNav('next', pos);
//         }
//
//         function toggleExpand(id: NoteIDStr) {
//
//             const store = storeProvider();
//
//             if (store.expanded[id]) {
//                 collapse(id);
//             } else {
//                 expand(id);
//             }
//
//         }
//
//         function expand(id: NoteIDStr) {
//             const store = storeProvider();
//
//             const expanded = {
//                 ...store.expanded,
//             };
//
//             expanded[id] = true;
//
//             setStore({...store, expanded});
//         }
//
//         function collapse(id: NoteIDStr) {
//             const store = storeProvider();
//
//             const expanded = {
//                 ...store.expanded,
//             };
//
//             delete expanded[id];
//
//             setStore({...store, expanded});
//         }
//
//         function getActive(): INote | undefined {
//             const store = storeProvider();
//
//             if (store.active) {
//                 return store.index[store.active] || undefined;
//             }
//
//             return undefined;
//
//         }
//
//         function filterNotesByName(filter: string): ReadonlyArray<NoteNameStr> {
//
//             const {indexByName} = storeProvider();
//
//             filter = filter.toLowerCase();
//
//             return Object.keys(indexByName)
//                          .filter(key => key.toLowerCase().indexOf(filter) !== -1);
//
//         }
//
//         return {
//             doPut,
//             doDelete,
//             updateNote,
//             lookup,
//             lookupReverse,
//             createNewNote,
//             setRoot,
//             setActive,
//             navPrev,
//             navNext,
//             doIndent,
//             doUnIndent,
//             toggleExpand,
//             expand,
//             collapse,
//             noteIsEmpty,
//             getActive,
//             filterNotesByName
//         };
//
//     }, [setStore, storeProvider])
//
// }
//
// export const [NotesStoreProvider, useNotesStore, useNotesStoreCallbacks,, useNotesStoreReducer]
//     = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
//     initialValue: initialStore,
//     mutatorFactory,
//     callbacksFactory: useCallbacksFactory,
//     enableShallowEquals: true
// });
//
// export function useNoteFromStore(target: NoteTargetStr): INote | undefined {
//
//     useLifecycleTracer('useNoteFromStore', {target});
//
//     // TODO: this won't work because the store value didn't change just the param value...
//
//     const targetRef = useRefValue(target);
//
//     const reducer = React.useCallback((store: INotesStore) => {
//         const result = store.index[targetRef.current] || store.indexByName[targetRef.current] || undefined;
//
//         console.log("FIXME: reducer:", result)
//         return result
//     }, [targetRef]);
//
//     const filter = React.useCallback((curr: INote, next: INote): boolean => {
//         const result = curr.id !== next.id || curr.updated !== next.updated;
//         console.log("FIXME: filter:", result)
//         return result;
//     }, []);
//
//     return useNotesStoreReducer(reducer, {filter});
//
// }
//
// export interface INoteActivated {
//     readonly note: INote;
//     readonly activePos: NavPosition;
// }
//
//
// /**
//  * Listen to the active note in the store and only fire when WE are active.
//  */
// export function useNoteActivated(id: NoteIDStr): INoteActivated | undefined {
//
//     function reducer(store: INotesStore): INoteActivated | undefined {
//
//         const {active, activePos} = store;
//
//         if (! active) {
//             return undefined;
//         }
//
//         const note = store.index[active] || store.indexByName[active] || undefined;
//
//         if (note) {
//             return {note, activePos};
//         } else {
//             return undefined;
//         }
//
//     }
//
//     function filter(curr: INoteActivated | undefined, next: INoteActivated | undefined): boolean {
//         return next?.note.id === id && curr?.note.id !== next?.note.id;
//     }
//
//     // return useNotesStoreReducer(reducer, {filter});
//     return useNotesStoreReducer(reducer);
//
// }
//
//
//
// /**
//  * Listen to the active note in the store and only fire when WE are active.
//  */
// export function useNoteExpanded(id: NoteIDStr): boolean {
//
//     function reducer(store: INotesStore): boolean{
//         const {expanded} = store;
//         return isPresent(expanded[id]);
//     }
//
//     function filter(curr: boolean, next: boolean): boolean {
//         return curr !== next;
//     }
//
//     return useNotesStoreReducer(reducer, {filter});
//
// }
//
