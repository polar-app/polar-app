# ! Source Image
FROM node:14.17-buster

# ! Extract Arguments
ARG USER_ID
ARG GROUP_ID

# ! Install pnpm & only-allow to force it's usage
RUN npm install -g pnpm only-allow jscpd @jscpd/leveldb-store

# ? Install Chromium for Karma
RUN apt update 
RUN apt-get install chromium -y --fix-missing

# ! Add env variables
ENV CHROME_BIN='/usr/bin/chromium' POLAR_EXTENSION_TYPE="PROD" ENV_NAME="master"

# ? Install jq
RUN wget "http://stedolan.github.io/jq/download/linux64/jq" -O /bin/jq && chmod 755 /bin/jq

# ? Change the UID of the user and group so files created/modified by this user
# ? match the UID of the Host machine user
# ? See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
RUN usermod -u $USER_ID -g $GROUP_ID node
USER node
COPY --chown=node:node .npmrc /home/node/.npmrc

# ! Set Work Directory
WORKDIR /polar-app

# ! Always pass auth tokens to Verdaccio
RUN npm config set always-auth true

# @ Expose the port for polar-bookshelf serving
EXPOSE 6006
EXPOSE 8050
EXPOSE 8051
