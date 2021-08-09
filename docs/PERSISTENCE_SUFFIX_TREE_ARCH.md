# Overview

We have a feature for block embeds where a user can embed a block simply by
typing it.

In order to do this efficiently we will need a "generalized suffix tree" to
index all possible suffixes of a string.

This tree will need to be persisted because building it will be computationally
expensive to do for every snapshot.

Additionally, constantly doing a write for each update and writing the FULL
index will be expensive from a bandwidth perspective.

If we have a 50MB suffix tree data structure, and the user updates one record,
we don't want to have to update it every single time.

# Chunk and Compaction based writes

We can mirror this the way 'log structured merge trees' work in
Bigtable/Cassandra etc to minimize the write throughput.

Here is the general idea.  

All data is stored into chunks of 1000 records.  Each chunk represents 

# Remaining Issues


# Future Optimization Issues

- Only support suffixes of 5 chars.  This would mean we can 
    
    
    - since this isn't a FULL suffix tree we can't match all possible patterns. it
      would only start on word count.
    
    - This will work for romantic languages but I need to think about Korean,
      Japanese, Arabic  - they are single char langs so a prefix tree wouldn't really
      work here.  In this situation we might just have to write every single token.
      We can use bigrams which will help keep the hit array shorter but I think it's
      going to mean a large amount of snapshot data - possibly the length of the
      entire snapshot size.


- Another strategy would be to build this on the SERVER and efficiently merge
  slabs in the client.

- Another modification on the server strategy could be to map each document to
  about 1024 'chunks' such that each chunk is it's own suffix tree in and of
  itself and the client does a merge of the suffix trees on read.  I think the
  merge wouldn't be *as* expensive but would take some time to rebuild the tree
  from the new data.  I'll need to think about this and code out the algorithm.

- It might be important to research papers on this - this might have already
  been implemented by someone else.
