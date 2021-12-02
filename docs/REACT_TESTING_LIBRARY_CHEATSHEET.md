# Overview

## Running under Karma.

We run RTL directly in Karma which means we don't have any tests using JSDOM. 

Since our karma configuration uses webpack, we also benefit from webpack in our RTL configuration.

## 

Here's a basic example but generally looks easier than cypress and there are Typescript types too.

https://testing-library.com/docs/react-testing-library/example-intro

I implemented two tests in ReactTestingLibraryButton.tsx and ReactTestingLibraryButtonTestK.tsx.

The file needs to be named TestK.tsx so that it gets tested via Karma.
