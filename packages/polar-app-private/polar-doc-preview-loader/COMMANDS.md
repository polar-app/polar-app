gcloud tasks queues create doc-preview --max-concurrent-dispatches=25 --max-attempts=5 
gcloud tasks queues describe doc-preview


# https://cloud.google.com/docs/authentication/getting-started


# gcloud iam service-accounts create [NAME]
# gcloud projects add-iam-policy-binding [PROJECT_ID] --member "serviceAccount:[NAME]@[PROJECT_ID].iam.gserviceaccount.com" --role "roles/owner"
# gcloud iam service-accounts keys create [FILE_NAME].json --iam-account [NAME]@[PROJECT_ID].iam.gserviceaccount.com


gcloud iam service-accounts create queue-admin
gcloud projects add-iam-policy-binding polar-32b0f --member "serviceAccount:queue-admin@polar-32b0f.iam.gserviceaccount.com" --role "roles/owner"
gcloud iam service-accounts keys create credentials.json --iam-account queue-admin@polar-32b0f.iam.gserviceaccount.com

export GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

gcloud tasks queues update doc-preview --max-attempts=1

gcloud tasks queues update doc-preview --max-concurrent-dispatches=50

gcloud tasks queues update doc-preview --log-sampling-ratio=1.0
