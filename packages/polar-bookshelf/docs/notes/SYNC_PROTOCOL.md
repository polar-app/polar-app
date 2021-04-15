
- make it just a stream of json documents

- we can have them build up a merkle-style tree and a hash root. this way we
  can re-compute the hash root without having to re-compute the full hashcode
  of full-document each time.

- if the protocol breaks , we can abort
    - The log contains the 'expected' hash and the client has the actual hash.

- PDF documents can just be Base64 encoded , and chunked if necessary... if there
  is a max document limit.

- then we re-play the entire stream.

- we can deal with partial replication sync by exposign teh full fingerprint
  of each document and skip them on the server.
