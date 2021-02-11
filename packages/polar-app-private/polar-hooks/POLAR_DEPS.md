#!bin/bash

publish_pkg() {
    pkg=${1}
    (cd ${pkg} && npm publish)
}

publish_public() {

    cd polar-app-public
    
    publish_pkg polar-accounts
    publish_pkg polar-backend-shared
    publish_pkg polar-firebase
    publish_pkg polar-html
    publish_pkg polar-pdf
    publish_pkg polar-search
    publish_pkg polar-search-api
    publish_pkg polar-shared
    publish_pkg polar-shared-webserver
    publish_pkg polar-url
    publish_pkg polar-webapp-links
    publish_pkg polar-spaced-repetition-api

}

publish_private() {

    cd polar-app-private
    
    publish_pkg polar-firebase-admin
    publish_pkg polar-webapp-dist

}

(publish_public)
(publish_private)
