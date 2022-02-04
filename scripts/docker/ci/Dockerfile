# ! Using circleci's base image as it's cached across all their hosts (Faster spin-up times)
FROM cimg/node:14.17.0

# ! Set USER
USER circleci

# ! Set Environment Variables
ENV GOPATH="/home/circleci/go" PATH="/home/circleci/go/bin:$PATH" POLAR_EXTENSION_TYPE="PROD" ENV_NAME="master"

# ? Install Linux binaries / Chromium
RUN sudo apt update && sudo apt install golang-go libvips libvips-dev pngquant --fix-missing -y

# ? Configure tag publishing setup
RUN mkdir ~/.ssh && \
    go get -u github.com/tcnksm/ghr && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
    git config --global user.email "ops@getpolarized.io" && \
    git config --global user.name "ciops"

# ? Install Global node_modules
RUN sudo npm install -g pnpm && \
    sudo pnpm add firebase-tools only-allow semver jscpd @jscpd/leveldb-store --global

# $ Install Playwright's Dependencies
RUN pnpm dlx playwright install && sudo pnpm dlx playwright install-deps

# $ Set npm configurations
RUN npm config set legacy-peer-deps true

# ? Install Sentry-cli
RUN curl -sL https://sentry.io/get-cli/ | bash