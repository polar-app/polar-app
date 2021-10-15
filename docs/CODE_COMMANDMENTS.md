# Code Commandments

Here are some commandments for code that are sort of the most important aspects
of development that happen somewhat often (especially for new developers) that 
we want to minimize.

## Pull Request == Production

If you sent a PR it will be merged and your code will be in production in 15
minutes.

We ship VERY often so make sure your code is production ready when you send a PR.

## Duplicates

Please DO NOT duplicate code between components.  This is something we can't
catch easily, especially if symbols change within the code.

The way to handle this is to write a higher level react component or copy that
code into a function.

## CSS

We DO NOT allow CSS in any of our code.  If you have to do something custom via
CSS you're probably doing it wrong.  All the MUI components can be used and
implemented without CSS.

If you really DO need CSS pleas ask a senior frontend engineer.  We might have
to put this CSS behind a component and then use that component rather than use
CSS directly.

### Absolute Positioning or Fixed Height and Flexbox

Related to CSS, if you have to do anything with fixed height font sizes, or doing 
any type of work with pixels, you're definitely doing it wrong.  

You should be using flexbox for and margin/padding.  Left/right layouts and 
row/column (especially with centering) should all be done with flexbox.

## One Context Git Branches

Ideally a git branch should cover ONE specific topic/context.  Don't do 5-10
things in one git branch.  It makes it very very very hard for your reviewer to
understand the branch and if there are fixes needed within one context of the
branch it prevents us from merging the branch for the other features.

## Small Branch PRs.

All branches should be small and never more than 1-2 days worth of work.  Large
branches cause reviewers to choke on them and increases the chance for the reviewer
to miss potential bugs or design issues.

### Commit Early, Commit Often.

If your code compiles, and it's been more than 30 minutes, commit your code on your branch.

This will trigger CI and if your code fails to integrate you know EXACTLY where
the bug was and you can fix it quickly.

### Stacking Branches

If you have a complicate feature that WILL take a week or more to land, stack
the branches.

Work on myfeature1, work on it so that you have some minimal functionality,
maybe a v0, then send the PR for myfeature1 and while that's being merged branch
off that and work on myfeature2.  When you create that branch though make sure
to merge the latest master so you're working from the latest code to minimize
merge conflicts with master.

## Typescript 'any'

If you have to use 'any' in Typescript you're almost certainly about to make a
major error in typing.  If you MUST do this put this behind a function and
use the 'any' within the function.

Most of the time using 'any' is almost certainly the wrong thing to do and can
cause a lot of bugs later on.

