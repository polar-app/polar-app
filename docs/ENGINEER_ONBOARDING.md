

# We run a multi-module setup

We use lerna and yarn to build Polar and we use multiple modules to organize these into smaller packages/modules
to keep things a bit cleaner.

Modules have the following advantages:

- Allow you to focus just on a specific section of the code that has a given area of concern like PDFs, or react, without
  having to understand a much larger project.

- You can isolate code that uses one specific library and just add complex dependencies in one place.

- Testing for that module can use complex test dependencies like an embedded server and you can keep this configuration 
  isolated to one module.

- Any ugliness necessary for one specific module can generally be hidden within that module including compiler settings.

- Composing multiple modules means we can build derivative apps like chrome extensions without having to pull in massively complex dependencies.

# Add FEEDBACK_REQUESTED to PRs for additional targeted feedback during pull requests.

If a PR gets long and you're concerned about a specific section please add a comment like:

```// FEEDBACK_REQUESTED```

so that your reviewer can focus on this section specifically.

You could also add:


```
// FEEDBACK_REQUESTED: START


// FEEDBACK_REQUESTED: END

```

to cover a large section.
