
# Bootstrap Locally

To bootstrap locally run the following:

```bash
yarn run purge-node-modules && rm -f yarn.lock && lerna bootstrap --ci
```

This is necessary because we can't wrap these command as yarn command itself
because yarn has bug when running from within yarn.

The --ci command in bootstrap forces you to use the same packages defined in
yarn.lock and no new packages are evaluated to be added to the dependencies.

This is necessary because a version could be updated and you'd get the most
recent version of the package rather than what master wants you to use and
this could yield to other bugs.

# Potential Bugs

## Don't run Yarn from within Yarn!

Yarn has bugs where you can't run yarn from within yarn.  There are
security/credential issues which only seem to cause issues when trying to access
the repo for new packages. When working with local/cached packages that's not an
issue and it SEEMS that things are working properly. 

# Full Package Update Design

- I could use Cloud Run to:
  - create a remote VM from the command line, locally
  - then, on the remote machine, checkout master
  - create a named branch there
  - run a script that's inside polar-app 
  - commit that code
  - push the branch
  - create a PR for this request
  - wait for CI within that container to successfully integrate
  - auto-merge it to master (since it was successful)

  - this could be one script like

    - ci-auto-commit burton-firebase-upgrade1 "polar-dep-upgrade firebase 1.2.3" 

  - TODO:
    - this probably needs a command, branch name, and commit message the result when it's finished
    - this will allow us to ALSO build a script that does the upgrade
    - 

# Upgrading package versions

Upgrading packages in our stack is a bit hard and prone to build and configuration errors. 

You should NOT have a PR that intermingles package.json version packages and regular code.

```bash
yarn global add polar-npm
lerna exec --concurrency=1 --parallel=false --no-bail -- npm-upgrade-pkg typescript "3.9.5"

time (yarn run purge-node-modules && rm -f yarn.lock && lerna bootstrap) 

```

Then commit these changes and send a PR. 

# 
