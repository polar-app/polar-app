
# curl --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X DELETE "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/ai_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs"


curl --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/ai_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs/_mapping?pretty"

# FIXME: this is bullshit.  The type should be keyword not text but it won't let me change it and it
# won't delete the mapping when the index is deleted.

curl  --user "elastic:JLtiXsMuEEwX1qQjJTAiOSHQ" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/ai_ft_digest_545445733244727031386635397a6645633050336966426f62503932_docs/_mapping?pretty" -H 'Content-Type: application/json' -d '{
      "properties" : {
        "docID" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 100000
            }
          }
        },
        "id" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 100000
            }
          }
        },
        "idx" : {
          "type" : "long"
        },
        "pageNum" : {
          "type" : "long"
        },
        "text" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 100000
            }
          }
        }
      }
    }
'
