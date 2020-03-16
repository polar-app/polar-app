#!/usr/bin/env bash

# TODO:
#
# create like 20 users here and randomize them so that we don't hit our per user
# login limits.
#
#   - one challenge is what happens when we have a high degree of parallelism and
#     we get a conflict

export FIREBASE_USER=getpolarized.test+test@gmail.com
export FIREBASE_PASS=mk9z79vlquixvqd

export FIREBASE_USER1=getpolarized.test+test1@gmail.com
export FIREBASE_PASS1=mk9z79vlquixvqd

export FIREBASE_USER2=getpolarized.test+test2@gmail.com
export FIREBASE_PASS2=mk9z79vlquixvqd

for id in `seq 1 9`; do
  # echo ${id}
  export FIREBASE_USER${id}=getpolarized.test+test${id}@gmail.com
  export FIREBASE_PASS${id}=mk9z79vlquixvqd

done

export GH_TOKEN=26722e632127b9548ce62024686d64c38e2b1994
export CSC_IDENTITY_AUTO_DISCOVERY=true

export FIREBASE_ADMIN_CONFIG='{"projectId": "polar-test2", "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq2kd7DkEfK5aY\nhszTDJCO0+goukYt01sSXEpNwwf7HeXIxI44TnMWCV84hCT+zS2TpBBdTYbBEaFF\nS1oPZxSBMSYazsBrrJDsvjflK2bdeF2KW2VSfpUtTieoyS7betFmcdMjj11Fb3DS\nw2rFf2qVCzRKbkHOHQCdqLoduTd4sCX5YfcHO01yvJj5JQkcaD9TtpZ0rNpwGT/K\n8eK+VE3yQR/xpkwiVXBqj5aALsXy8QJr+xmSoV6g/hZDpEsjJJwb6T/xIm23afO5\nUyAWASeq3nAy9wyde/qXqEBQRqAkGdlHn2u++tbZaWj/X7zYx6e8jBY1GEZfYS7n\nmzpUlPZhAgMBAAECggEAIvxfd6p48w7IQXKbYrlVc6GHzUFqoPsCbyrGeu0Z7EPY\n7l6xnRu6s0a0I7Qz2q1wI7VmJrAc6fgZYTxHb1H40QIkXgv8yE2NzWbM5tvfWBDN\nRoY1AuQOjxA8gj1uOI4EUdGVFZAO4gAm+47XAhLoKsnfgVMJhI33gIUZLMJhzB2Q\nhgnZM2eOmnEiICIiy6YR3RDuvq1NpB6FTxWxnIFH2IlhTkxIdHLgqPLsubXWpTV+\nkVTfvnlLRCBe8scELt50GkKTQLflvuaSgRBxP39z0nDMxV+suAUYwKi3owKl/xW/\n/VET+0gLwKGy/8vafYwx17Ay4IPM528KFNdvUmvKjQKBgQD7vNNRlrT7CsONvvwA\nsSzCrU75T6uf3Ntp2ACf7qM4mFR9fuEy7TM+h0SR10s4HopiH1SPF4SV35xqv7YQ\nHsaodXtjClXOpSCp1C6Bl5N0rq8FfYllkc3XLwI5tY46n30E8QU96GGFAcUKdyW/\nof74IDuv7WopFfeEjnbxyFXcFwKBgQDu1EPHGevuB8ypi5jlPD8/1sMvISzaW4r+\nhh+TdpgVzUQ+mwEgNzj6fIrFZZ23i/k8c+R5WWQCK1oXC64RU/VoV9Ng/11nb0/H\n7MZe/LFQ3gOlzqr7aHTga1z9xl8cwq94j7ytvLD/LLFOXeH7f8Q31Yc2uMgddtRs\n94guzVn0RwKBgHsvjaERRILMY6FLYfncuXCSamDpsaxK4TvMLZIVrt2U/VNj8UOA\ne2EPxGgxmGdf2ovllPVopsLIZ7x9D9SXmtL4mmZ+ujqi53bzk8ZqrAefK5peMgv3\n62hvYoFm7LCXNxBh+RSwUHhLw2Y5o8lAtoopC8wtO5PbYgIFzQLH6+wFAoGBAJTI\n8CCNaYm0mi/Vo77LtauTo60swcCW3xSJggpgC4cphaZq8lybioeiJuGq2IKMVQzw\nNhnTMpaXY1yQDjUFVRFYBXucGxhhJBaszzhFvEFgzmzxP1u4S3ez6w6+Emrcbmxx\nP14M+0c9FIh5vFrt0dPm1oGkxCZ27QelfdWKYMvpAoGABqGlwoLwcDvXx2thOQX4\nBYPAur5Ge3OtvGuP0AADZZe5m7t1DHTE42JnoRstYCbx1dffzd+ZYbIFixc9wi6q\n3SIAf+sfVSO9JN1oBx6AEt2HSv6OiYToz4edePVov14kv00QrL6VOmTfC3Xdss1R\nMzQIdCYhpvlQOOMNSW2dUMs=\n-----END PRIVATE KEY-----\n", "clientEmail": "firebase-adminsdk-b7l64@polar-test2.iam.gserviceaccount.com"}'

## used so that we run tests offscreen so that we don't pollute the UI...
export SPECTRON_OFFSCREEN=true
