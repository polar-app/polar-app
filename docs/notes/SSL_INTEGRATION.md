Right now we should just make our express APP use HTTPS and then trust the key 
within electron.

openssl genrsa -out polar-ssl.key 2048
openssl req -new -key polar-ssl.key -out polar-ssl.csr    
openssl x509 -req -days 365 -in polar-ssl.csr -signkey polar-ssl.key -out polar-ssl.crt

