We need a way to support notes and flashcard metadata along with polar and
it might be better to build our own streaming slab store.  The idea being that
the files are immutable and deletes are done via tombstones.

One issue is that firestore supports indexes but this wouldn't.  I need to
figure out if all the features we need are supported on disk.


