# ! Source Image
FROM ubuntu:20.04

# @ Enable bash capabilities
SHELL ["/bin/bash", "--login", "-i", "-c"]

# ? Update and install Necessary Packages
RUN apt update && apt upgrade -y
RUN apt install wget curl -y

# ? Install jq
RUN wget "http://stedolan.github.io/jq/download/linux64/jq" -O /bin/jq && chmod 755 /bin/jq

# ! Extract Arguments
ARG USER_ID
ARG GROUP_ID

# ? Change the UID of the user and group so files created/modified by this user
# ? match the UID of the Host machine user
# ? See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
RUN groupadd -g $GROUP_ID node && useradd -u $USER_ID -g $GROUP_ID node
USER node
COPY --chown=node:node .npmrc /home/node/.npmrc

# ? Install Node.js using nvm & Needed Libraries
RUN touch /home/node/.bashrc
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN source /home/node/.bashrc && nvm install 14.17.0
RUN source /home/node/.bashrc && \
    npm install -g pnpm && \
    npm config set always-auth true && \
    pnpm install -g only-allow jscpd @jscpd/leveldb-store && \
    pnpm dlx playwright install

# $ Switch user to root & Install playwright OS dependencies
USER root
RUN ln -s "/home/node/.nvm/versions/node/v14.17.0/bin/node" "/usr/local/bin/node" && \
    ln -s "/home/node/.nvm/versions/node/v14.17.0/bin/pnpm" "/usr/local/bin/pnpm"
RUN pnpm dlx playwright install-deps
USER node

# ! Add env variables
ENV POLAR_EXTENSION_TYPE="PROD" ENV_NAME="master" WEBPACK_BUNDLE="repository"

# ! Set Work Directory
WORKDIR /home/node/polar-app

# @ Expose the port for polar-bookshelf serving
EXPOSE 6006
EXPOSE 8050
EXPOSE 8051
