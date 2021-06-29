FROM node:14-buster

ARG USER_ID=1000
ARG GROUP_ID=1000
#
## Install base OS prerequisites
#RUN apt update && apt upgrade -y && \
#    apt install -y curl
#
## Install Node LTS and NPM v6
#RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && \
#    bash ./nodesource_setup.sh && \
#    apt install -y nodejs

RUN node -v
RUN npm -v

# Install Lerna globally
RUN npm i -g lerna

# Change the UID of the user and group so files created/modified by this user
# match the UID of the Host machine user
# See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
#RUN groupmod -g $GROUP_ID node
RUN usermod -u $USER_ID -g $GROUP_ID node
USER node

COPY .npmrc.bytesafe /home/node/.npmrc

CMD ["cat", "/home/node/.npmrc"]
CMD ["lerna", "bootstrap"]
