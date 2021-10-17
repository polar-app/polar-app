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


There are three type of files:

    - entry points: Files that are compiled and imported by HTML/webpack or used on the command line (node) but 
                    don't have any immediate dependencies so they could accidentally be computed as orphans.
                    These should count as dependencies but shouldn't be allowed to be computed as orphans.

    - main: Source files that are regular source files, are used by tests, and entry points, and can be counted
            as orphans.

    - test: Test files that shouldn't be calculated as normal orphans because they should NEVER have any imports.
            but if they import orphans then they should count as orphans too.

    - TODO: maybe we don't have to compute tests that are in error, just let the build fail... 

... we're still getting confused when:

    - testing infra code is linked to from just ONE test and itself doesn't have tests
    - tests share some testing code among themselves and other tests...
    
