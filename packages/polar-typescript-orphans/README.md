V2 of stale finding of Typescript code.

Last version was done by an intern and the code wasn't very good.  

We needed something that is module aware... 

TODO:
    - tests need to be handled in a special manner because we ALSO have to purge 
      them when they import a class and they are the only import.  Otherwise, we
      are going to not be able to purge some code.

        - The problem is that we're going to have to report these as only being 
          used by tests and then after we also have to purge the test ... 

        - What I think we need to do is:
            - NOT count imports from tests 
            - Flag test code with a special pattern so that the indexer knows to treat them specially.
            - If they link to code, that is now an orphan, then those tests count as orphans.

        - I think tests could require a second algorithm
            - We first compute source references without tests and compute the normal ranking algorithm without
              counting test imports

            - Then we find tests that now link to orphans.

            - Then we report the orphan tests
    

        - TODOL this is wrong... a test is an orphan test if it links to something that is now an orphan.
