# Requirements

## v1

- ability to run manually an individual test via Karma that tests with chrome headless
- should support easily enabling karma tests in each lerna module - shouldn't require difficult configuration
- Way to define a karma-only test that isn't run with Mocha
    - maybe we detect what runtime we're running under and have them skip if the runtime isn't correct
    - 


## Optional/Future

-
- Break everything out in a dedicated pipeline in CircleCI running all existing tests via Karma
- Test with Firefox
- Test with Safari/WebKit
