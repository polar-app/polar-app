
# delete an index



curl --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X DELETE "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/ai_ft_digest_docs_545445733244727031386635397a6645633050336966426f62503932?pretty"


# Get the current index mapping for an index

curl --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/ai_ft_digest_docs_545445733244727031386635397a6645633050336966426f62503932/_mapping?pretty"
