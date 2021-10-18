# Undefined and nested arrays.

Firestore doesn't support storing keys with undefined values. 

It also doesn't support nested arrays within arrays.  

We have some code called FirestoreRecords to fix this and you can just convert() objects directly.
