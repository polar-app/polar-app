# ! Using circleci's base image as it's cached across all their hosts (Faster spin-up times)
FROM circleci/node:14.17.0-buster

# ! Set USER
USER circleci

# ? Install Linux binaries
RUN sudo apt update && sudo apt install golang-go libvips libvips-dev pngquant chromium --fix-missing -y

# ? Configure tag publishing setup
RUN mkdir ~/.ssh && \
    go get -u github.com/tcnksm/ghr && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
    git config --global user.email "ciops@getpolarized.io" && \
    git config --global user.name "ciops"

# ! Set Environment Variables
ENV CHROME_BIN='/usr/bin/chromium' GOPATH="/home/circleci/go" PATH="/home/circleci/go/bin:$PATH" POLAR_EXTENSION_TYPE="PROD" ENV_NAME="master"

# ? Install Global node_modules
RUN sudo npm install -g pnpm && \
    sudo pnpm add firebase-tools only-allow semver --global

# $ Set npm configurations
RUN npm config set legacy-peer-deps true