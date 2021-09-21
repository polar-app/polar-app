<h1 align="center">
  <br>
  <a href="http://getpolarized.io"><img src="https://getpolarized.io/static/logo-e66969952d7d23385b2b3d00a4486944.svg" alt="Markdownify" width="200"></a>
  <br>
  Polar
  <br>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.2.x-blue"
      alt="Node Version" />
  <a href="https://app.circleci.com/pipelines/github/polar-app/polar-app">
    <img src="https://circleci.com/gh/polar-app/polar-app.svg?style=shield&circle-token=63bfce3eab16480a00d0dc51fcbb21261d38d31c">
  </a>
  <img src="https://img.shields.io/badge/node-14.14.0-brightgreen"
      alt="Node Version" />
  <img src="https://img.shields.io/badge/npm-7.19.1-green"
      alt="Node Version" />
  <br>
  Polar is an integrated reading environment to build your knowledge base. Actively read, annotate, connect thoughts, create flashcards, and track progress.
<p>

# Resources Access

- you reading this means we have configured both github / company email access
- Firstly install the [Zenhub Extension](https://www.zenhub.com/extension) to see our issues board from inside github
- Download, Install [Slack](https://slack.com) & Join with your company email
- Login to [circleci](https://circleci.com) with github & allow access to see the pipeline status
- If you need access to AWS or GCP message Kevin on slack
- For Designers and Front-end Engineers our Designs are all in [Figma](https://www.figma.com/file/KwjTPO5nzYRGV2I1Laxjlf/Polar-new-designs?node-id=743%3A21467) Focus on handover
- For Front-end engineers install the [React Developer Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) for much easier debugging

# Stack

- **Typescript** - Everything is done in Typescript with generics
- **Webpack** - to compile and bundle our webapp
- **Lerna** - provides our multi-module system
- **Circleci** - for automated pipeline builds and deploys
- **GCP** - Firebase - provides the backend (Firestore)
- **AWS** - Lambda for payment gateway functions for now

# External Libraries / Frameworks

- **Material UI**
- **pdf.js**
- **epub.js**
- **readability**

# Steps to Build (Windows-WSL2)

- If you're on Windows you should download the latest version of Windows Subsystem for Linux. [Follow The Guide Here](https://gist.github.com/aeweda/989c24d21c5ae9b499fb7629245807ce)

- Install `Docker for Desktop`. [Here](https://www.docker.com/products/docker-desktop)

- After installation open up docker settings Resources -> WSL INTEGRATION -> Enable integration with ubuntu or the wsl distro you installed

- Validate that you can run Docker container by running exactly this command `docker run hello-world`. If it succeeds,
  you are good to go.

  - rebooting after installiation of docker is advised.

- Configure an SSH access token with github to clone the repo, simply run `ssh-keygen` and press enter for all prompts then `cat ~/.ssh/id_rsa.pub`, copy the content and add it to the ssh keys in the github settings

- Clone the repo with `git clone git@github.com:polar-app/polar-app.git` **IN WSL !Do not i repeat do not use windows' file system**

- install nvm to use npm/node with this [Guide Here](https://gist.github.com/aeweda/6828cedddee3ea268f03a6ff4551c45d) **Never use sudo with npm**

- Run `npm run bash` (from inside your git repository) which launches a Docker container and steps you into the `bash` terminal of that container. Note
  that the Polar source code is "mounted" to the /polar-app folder within the container. Any change you do to files within
  that folder within the container, is reflected outside the container and vice versa.

- Now is the time to install all dependencies of all packages. Use `lerna bootstrap` to do that (remember that we need
  to run this within the bash of the container)

- To compile all packages, run `lerna run compile`

- To compile only Polar Bookshelf (the main React app), go to `cd packages/polar-bookshelf` and run `npx webpack serve --host 0.0.0.0`

- NOTE: if you get "JavaScript heap out of memory" errors, an alternative that's
  slightly slower but uses slightly less RAM:

  `node --max-old-space-size=8192 ./node_modules/.bin/webpack serve`

This _should_ mean you have all code running and Polar should load http://127.0.0.1:8050 in your browser.

# Potential Errors (MacOS)

You might need to run `ulimit -n 1000000` and then 'ulimit -n' to make sure this setting was accepted by the OS.
Some users report a bug with npm that causes it to tail to garbage collect open file handles and this fixes it.

### increasing file handle limit

```bash
sudo launchctl limit maxfiles 1000000 1000000
```
