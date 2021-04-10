# Setting CORS configuration:

```
 gsutil cors set cors.json gs://stash
 gsutil cors set cors.json gs://public
```

https://cloud.google.com/storage/docs/configuring-cors

If this is a preflight request, see if it includes one or more
Access-Control-Request-Header headers. If so, then ensure that each
Access-Control-Request-Header value matches a ResponseHeader value in the
bucket's CORS configuration. All headers named in the
Access-Control-Request-Header must be in the CORS configuration for the
preflight request to succeed and include CORS headers in the response.

# current headers are:
# access-control-expose-headers: Content-Length, Date, Server, Transfer-Encoding, X-GUploader-UploadID, X-Google-Trace

curl 'https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/stash%2F12RMNjmX1PLwqN5fRXzh89Yi7tbL24e5VfCNs4Nq.pdf?alt=media&token=0a2708be-ef63-4791-a338-a3c887b73b19' -H 'Referer: https://localapp.getpolarized.io/pdfviewer/web/index.html?file=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fpolar-32b0f.appspot.com%2Fo%2Fstash%252F12RMNjmX1PLwqN5fRXzh89Yi7tbL24e5VfCNs4Nq.pdf%3Falt%3Dmedia%26token%3D0a2708be-ef63-4791-a338-a3c887b73b19&filename=12LbgQGLbr-The%20Complete%20Guide%20To%20Statistics%20For%20The%20SaaS%20Executive.pdf&zoom=page-width' -H 'Origin: https://localapp.getpolarized.io' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' -H 'DNT: 1' --compressed

Access-Control-Allow-Headers: Range
Access-Control-Expose-Headers: Accept-Ranges, Content-Encoding, Content-Length, Content-Range

current headers are:

access-control-allow-origin: https://app.getpolarized.io
access-control-expose-headers: Content-Length, Date, Server, Transfer-Encoding, X-GUploader-UploadID, X-Google-Trace


https://github.com/mozilla/pdf.js/issues/4530
https://github.com/mozilla/pdf.js/issues/3150
