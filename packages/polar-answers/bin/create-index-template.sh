#!/bin/sh

curl --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/_template/template_1?pretty" -H 'Content-Type: application/json' -d @create-index-template.json
