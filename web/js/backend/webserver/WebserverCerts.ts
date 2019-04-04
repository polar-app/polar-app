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
MIIDKzCCAhOgAwIBAgIJAIaoSVmdM6HdMA0GCSqGSIb3DQEBCwUAMCcxCzAJBgNV
BAYTAkNOMQswCQYDVQQIDAJHRDELMAkGA1UEBwwCU1owHhcNMTkwNDA0MDExMDM0
WhcNMjkwNDAxMDExMDM0WjBaMQswCQYDVQQGEwJDTjELMAkGA1UECAwCR0QxCzAJ
BgNVBAcMAlNaMQ4wDAYDVQQKDAVQb2xhcjEhMB8GA1UEAwwYbG9jYWxhcHAuZ2V0
cG9sYXJpemVkLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1ozl
J80OttfsC3+PJ91VwbkqJdLNVWAtkrfCc88Hsos6RujdVFVRohJpOwZQ6lE6tuhi
iMOcHYr2U4CNw60/VV5VsEmSgrbQETj42sqhvTTeSwS7iZEoYtgbXcMmcTYD3UaR
/++pIir8uZELRtMBCZnBIhFuN7RzByUMVGJ4q+SoSSN+TSExYmM53kOPVnXlU5fq
+41voNH7EK2+Ox1X3S1CSGU4lKXzCLJFmr93KBnEnlQSwI7WX0Hk38EeRS2EB4bz
RSKJWmUB7tHgmbx+Yr3UBUiSFjFRZ0Wwkn+tTcgcomOL8Oob5unHbDigmZ9tYHCB
91Ud885y5m+v3Gn5PwIDAQABoycwJTAjBgNVHREEHDAaghhsb2NhbGFwcC5nZXRw
b2xhcml6ZWQuaW8wDQYJKoZIhvcNAQELBQADggEBAACOcwM5Zr1jaTGZ0JxJIQNe
41meVU0NcLg9O2YTgDsCCBnUcrE3hOrKpP5LSlDM2Z8MfSkcsc5OeOVhmrNq3V47
duy2Tz6ehLsY3GyDaXKH33BLeyD7iILHZUT+OXS+GUeDIiE2R8NcdDl6dyFKzBg1
uuLhTKEVZP9TRroGAX9eLBlyLSui/yS0+gxB73lGGTuw2XmrHUkZtMfJVyqUvgjI
sTR38JUESax52klbBZ/UgH3u7UeP1ukPrvfXgbb1uzK3XBJm/VPu+1bc7cvxqZN8
fDAuk/wFPqShTd+JoMLZd9l7w/lJ3YJYWeiT+zBtpXejYaELaMJoHyP/RxILZ/M=
-----END CERTIFICATE-----`;

    public static KEY: string =
`-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDWjOUnzQ621+wL
f48n3VXBuSol0s1VYC2St8JzzweyizpG6N1UVVGiEmk7BlDqUTq26GKIw5wdivZT
gI3DrT9VXlWwSZKCttAROPjayqG9NN5LBLuJkShi2BtdwyZxNgPdRpH/76kiKvy5
kQtG0wEJmcEiEW43tHMHJQxUYnir5KhJI35NITFiYzneQ49WdeVTl+r7jW+g0fsQ
rb47HVfdLUJIZTiUpfMIskWav3coGcSeVBLAjtZfQeTfwR5FLYQHhvNFIolaZQHu
0eCZvH5ivdQFSJIWMVFnRbCSf61NyByiY4vw6hvm6cdsOKCZn21gcIH3VR3zznLm
b6/cafk/AgMBAAECggEAJiU+yOjIaPHS4eh4B1pu2NaXC8qC/17uO1u4kuaIM9JV
Ni5Iy6mvreUgGIJy+HYgvkxq2G4O36HJUedVTSkMTZ1MFt+90Me4DpfWhu/n+b/g
le3tefP4/jn2A6GiwBYeccUOSDbQF2cVL9j97EWvtYlEsU3wDq9ilC6eFpK7abQW
Nbre8htNaj1OeQkko2SVg4dLMYzQdxMDE665Lso8MSjn259xtChRMyPMu/6WRDVg
7f2uncGpVY6ILsMYbm97H+crX8OObVRI35hKyMvf1VxKWOjL0xea9E0r149Co+VQ
3+cvqRTotv6vy1wWQyWaGs/o0Jucb4mtc6P/Ojvh4QKBgQD8jp5HMHyFpqRFuFE+
aaPA1koZBdNyn/SLLmQ/nNvRe33Qo+vowvKyakpIMXALXwu0gRuJDAgDYPy/m7YX
7txSz9pIaIZYmMsfqHFKTm8hX0jmPmwZMzbX4/KwkqyzDTxN0NVyhg7Ve69giD//
ENleqgYCLgDmHkiRQ/B/1WHoGwKBgQDZeaPIiPPGamU165n1QKIjm7GBngUrwk33
bTBXY71I9yX5aI3CVoiDEcXwO81k3oGDx9SD1FV0XJIBB68eNRmHWvPeHs8GpDBg
kFknGYCsKwA6YirYxKvzfsBo6gyUamD+En+bvYp43XzeA29/5G/+W4B6U47P+fKR
zxvn6lBNrQKBgGm2qLnTqcunvQsR46/kOA73o3xl2+QW4B2CBaQ63CgLMNasRorf
TwcvRniBeQzJc/TSNdxflNsVNbZeTxIlgUOIjS3R0qozCpLtxr37pripUbJOXqEN
tt8XIvaV7oPj/mH0D+QoCP2DEB2v6lmxi8r8EBfJecbY1jc34OshPiIRAoGAd/ZA
YWMiTYXtFIRE5eNkTQ4aKWy4X34MMfsaGmqbRD+Iw/5njBbdsKdCL5VdZFHU0ZOO
Z7Xd+ZUCuOy7LYeO8Ho8YX9PJdO2F94oP4gy0UXbF1mFVxON4oA9tOG+VLQlkqEz
oP45/xf2RCVTARJKsN1ajp++/Hxc0Q+UziYTa/UCgYAj/H+2+2n3tTRsSlD2/yqS
hBsfC6m4QD/Tp9/J/vXgBpvoPIoQUBrFVxhv+8uiu/+hVtNuncZgo9f6OlukA1aJ
jqSJ5otTQc6zIb9pQ7IgItYvgwQsGCOegpW8Qdwsgh5iUogE444ZhV6Dd2odFuoF
x6d3DLzWWhKvGYDJ9wCKLQ==
-----END PRIVATE KEY-----`;
