curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243?pretty=true"


curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/_ingest/pipeline/attachment" -H 'Content-Type: application/json' -d'
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data"
      }
    }
  ]
}
'

curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_doc/101?pipeline=attachment&pretty" -H 'Content-Type: application/json' -d'
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
'

curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_doc/101?pretty"


curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_doc/101?pipeline=attachment&pretty" -H 'Content-Type: application/json' -d'
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
'

curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_doc/101?pipeline=attachment&pretty" -H 'Content-Type: application/json' -d @./bigtable.json


curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "query_string": {
      "query": "*",
      "default_field": "content"
    }
  }}
'


curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_search?pretty" -H 'Content-Type: application/json' -d'
{

    "query": {
        "match_all": {}
    }}
'
curl --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X GET "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_mapping?pretty"


curl -v --user "elastic:jCvX1l8nC0HIe4l2rjcDvhIX" -X PUT "https://polar-search0.es.us-central1.gcp.cloud.es.io:9243/my-index/_doc/101?pipeline=attachment&pretty" -H 'Content-Type: application/json' -d'
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
'
