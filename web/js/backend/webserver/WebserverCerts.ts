/**
 * Raw certs for electron. Note that the private key here is distributed
 * publicly but is only vulnerable to attacks on localhost unless DNS is
 * hijacked. We're going to try to migrate to a new system that either:
 *
 * - Generates keys on startup which are ephemeral between instances.  This
 *   would require an attacker to have access to the Electron in-process
 *   memory which would not be practical.  Note that this is ALREADY better
 *   than serving over HTTP which we're currently doing.
 *
 * - Use a Electron specific system where we fake a webserver by using protocol
 *   handlers but right now this isn't insanely easy and I want to figure
 *   out a better way to handle this long term.
 *
 * NOTE: we're not actually using this at the moment and might back it out in
 * the future.
 *
 */
export class WebserverCerts {

    /**
     * The raw CERT data. Note that this should last ten years.
     */
    public static CERT: string =
`-----BEGIN CERTIFICATE-----
MIIDlDCCAnwCCQDmwK4pUDF44DANBgkqhkiG9w0BAQsFADCBizELMAkGA1UEBhMC
VVMxCzAJBgNVBAgMAkNBMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMQ4wDAYDVQQK
DAVQb2xhcjEhMB8GA1UEAwwYbG9jYWxhcHAuZ2V0cG9sYXJpemVkLmlvMSQwIgYJ
KoZIhvcNAQkBFhVhZG1pbkBnZXRwb2xhcml6ZWQuaW8wHhcNMTgxMTAzMTgzMjA2
WhcNMjgxMDMxMTgzMjA2WjCBizELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRYw
FAYDVQQHDA1TYW4gRnJhbmNpc2NvMQ4wDAYDVQQKDAVQb2xhcjEhMB8GA1UEAwwY
bG9jYWxhcHAuZ2V0cG9sYXJpemVkLmlvMSQwIgYJKoZIhvcNAQkBFhVhZG1pbkBn
ZXRwb2xhcml6ZWQuaW8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDW
QQI0zyNfDjJLL3wvLSyb0yn2a+sRm+d7ysA+XUyDo8aFau7j275q1+dVPmH/y+p/
nNkp7dMAAiNWFoqfl4xZPFeM3HbKA1tYGHZrboxkL+4KDJ5sdsXvdi0ZdHvC/T4i
SWhC9tQ8bS2p6PT2HsF1fHzEU3n+fYQSOcBH9Kxmb0F8ocr+4DGWPA9azKkR3xPl
EXXfytUFlpad6l9M/W2iXM95RrI10wClGL3jYR42iZZ47LAw84i2xsqBt7WQv/Wl
u65GE84gDk9CCRW7iEWmkCaOlJilOy/LJO/xJYbKnuMIgZgy9/9g8MXw5b+MaYH9
ONpKaYStj9Wl0zSrtgFpAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAH4K+BubOAA/
2l1ySsRLXAOt8Fjv4x/g7jNOj+8jJimDuqrt3u1Vg+N0NuIr26rFgiocuyN6ZHe2
CSfGzzOz6t7nZ7hSCjh6FGy0GqHxoY3RAGGJXUJcdfEwjXvYUkPwLdmOgID08Thp
MauTahy4IO0ji64WHQeyCreWJXg2gFwhNOnNwMtw2WxPK2mqUrLacAVGgl8IzkOh
jsAEKqB6KBba2EJtqxBdfA+9N1dfkM5Bm3Z0KWcWsnQ+DIoWgRyvQZJbHBWFhdzS
lzC0l5Or3TTAWTNlU8S/MxVJPV0OpUWmNVpTR1Lvdb1ztsAp8xf3UJJO4YRrty+R
Ods6EH6Wny0=
-----END CERTIFICATE-----`;

    public static KEY: string =
`-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA1kECNM8jXw4ySy98Ly0sm9Mp9mvrEZvne8rAPl1Mg6PGhWru
49u+atfnVT5h/8vqf5zZKe3TAAIjVhaKn5eMWTxXjNx2ygNbWBh2a26MZC/uCgye
bHbF73YtGXR7wv0+IkloQvbUPG0tqej09h7BdXx8xFN5/n2EEjnAR/SsZm9BfKHK
/uAxljwPWsypEd8T5RF138rVBZaWnepfTP1tolzPeUayNdMApRi942EeNomWeOyw
MPOItsbKgbe1kL/1pbuuRhPOIA5PQgkVu4hFppAmjpSYpTsvyyTv8SWGyp7jCIGY
Mvf/YPDF8OW/jGmB/TjaSmmErY/VpdM0q7YBaQIDAQABAoIBAAfwCKDkO68922cl
rzggOFLdk+RpQyA34m+Xp1+oHTmTS7uNpqQSdA+JSCzETuUnLNzldrYy9Wo+qgh6
dVBMUQrNTYEOeegqD6xH27tHMTRVAkClDwl9rP+eJTWYNy2WLEMg7RfuBRboBJUS
6GBl60zq+8RaQ17GT6pNMW55BhoVW7o0NeNq/GigV5GopxB4zfLErckyGgGFzbVr
3Xs6chlhIjBmwXJCAda5kHvYxKXBbww/zxx/YJhH8MuVrvNUgN2mToyXPIB0xYm+
2fcRE3UkTsI0v9Cj02ZNjZOWLTCbFUl629WDX1f3ZjRfRj/xIhXh/Sg4NSSRpaYz
OeMdUAECgYEA982dg1V7795TYnEkCwHr9rBa3kqsVCx7eI/rLfT6q8VtYdqNANPo
Ve63is5vsFEjBZTEs6gp5mzdM0EeV3MFyAyZgdZg3HfOjo/v1fDPC/IMCFdVT6R8
WysrPBPCDezbVprSUsGc0Y/tIWZ/0jIzpSnJU2+u9/rIaOq0mzbqa4ECgYEA3VdM
z4DP0f8a17hKfeQaFNDndM05KFIqzZU2Iq2iCZQN1uUOsNqX/pAQTsSt5dPjvWs8
TDZI4toX3pPX8MbntMBxcOAd88xijCI9+Lx8OlCWQ3x3KhGnNWbwb9fukQjA0YkV
MgDVZSKLN1UaKHq/+0ugIPsPLU1EBxsvdchiqekCgYAfw+LKIB4oDHbh6qD1LETk
NY0ga7AVhjI5rTE3jezIMiGoZoymq4Nf6J7skzPsBSqZH43rfcYJPLFKTbGnAh6e
m0beRu3ZtR3sVnUnFpxj6p4yP4e3Et3CDhGXvOymPlOLkYMeiqUgk/OQ0YPXHQpT
xLyDDpD+Rs6D7HpEX1DDgQKBgFPwxapz+Vx0WKOyul1f4hw+1WhQY/rMnnr0uWER
ZEApq83xdE7Rt47M58JXiHN+lgHB504n0CBoAWFhxCUF6d18lgjula1dt4nZepMY
OCyNX08cpryHkVgJP+nKhCjwnt9YE3exJTyDizRiy9bKJoCQv5uCWtEdWk0vnCIY
6oHxAoGAHbUWNRHE0w3shKqOOm5IIxma1Uvfp7xC9CoerOJu6CXL2LRqjJC2zWFP
8ycli3o3xWXtVL81bd51nhKepbsofIl50qm5i/HqfHHUFf5jnkDB7nfTRAePuEei
MfBK0RRPala4EL7jgGJ0JjhTLE3QbLyiw1POg0y57MVf97/1baQ=
-----END RSA PRIVATE KEY-----`;

    public static CSR: string =
`-----BEGIN CERTIFICATE REQUEST-----
MIIC0TCCAbkCAQAwgYsxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEWMBQGA1UE
BwwNU2FuIEZyYW5jaXNjbzEOMAwGA1UECgwFUG9sYXIxITAfBgNVBAMMGGxvY2Fs
YXBwLmdldHBvbGFyaXplZC5pbzEkMCIGCSqGSIb3DQEJARYVYWRtaW5AZ2V0cG9s
YXJpemVkLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1kECNM8j
Xw4ySy98Ly0sm9Mp9mvrEZvne8rAPl1Mg6PGhWru49u+atfnVT5h/8vqf5zZKe3T
AAIjVhaKn5eMWTxXjNx2ygNbWBh2a26MZC/uCgyebHbF73YtGXR7wv0+IkloQvbU
PG0tqej09h7BdXx8xFN5/n2EEjnAR/SsZm9BfKHK/uAxljwPWsypEd8T5RF138rV
BZaWnepfTP1tolzPeUayNdMApRi942EeNomWeOywMPOItsbKgbe1kL/1pbuuRhPO
IA5PQgkVu4hFppAmjpSYpTsvyyTv8SWGyp7jCIGYMvf/YPDF8OW/jGmB/TjaSmmE
rY/VpdM0q7YBaQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAA7mxTaWD0HncKrF
S/qDtfuA+Kn8Y1V4Wuc6WcI9lksz8eGn7Dx9mXUqXXzCaxgNkZGlnus50y3uhtFb
i+Gq6PudirvPi50Gz6ib7Ea2tRPSZbniOlj/O2BOonYYazo8NkqgVk5/LQeV567X
fBuLzwKduAYMVY4DCmecHljx+RgynhC7TIYfABEfWc/LwxjE3bbbrngHEzGPZ1ia
3n5L0ygc3CDRoGtyZHQr3qOACtdp4Z3rdpkUdAHZsXKRUtZ3IiibDSgSucxoK609
JesR9yBlquSdB8Nt8mdYGEmRUXa9AgghlkZgXr5bUfMEvoSZxA8UTeFkI/Mo7TZF
vCUYVb4=
-----END CERTIFICATE REQUEST-----`;

}
