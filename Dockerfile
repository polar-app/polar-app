FROM node:14.14-buster

ARG USER_ID
ARG GROUP_ID

RUN node -v
RUN npm -v

# Install Lerna globally
RUN npm i -g lerna @lerna/global-options
RUN npm i -g --force yarn

# Change the UID of the user and group so files created/modified by this user
# match the UID of the Host machine user
# See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
#RUN groupmod -g $GROUP_ID node
RUN usermod -u $USER_ID -g $GROUP_ID node
USER node

COPY --chown=node:node .npmrc.bytesafe /home/node/.npmrc

WORKDIR /app

# Always pass auth tokens to Bytesafe
# This is important!
RUN npm config set always-auth true

# Mount the yarn cache to presist on different containers
RUN yarn config set cache-folder /polar-app/.cache

EXPOSE 8050
