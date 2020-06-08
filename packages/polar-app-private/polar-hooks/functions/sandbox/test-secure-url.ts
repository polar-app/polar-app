import {File, Storage, GetSignedUrlConfig} from '@google-cloud/storage';

const conf = {

    projectId: 'polar-32b0f',
    credentials: {
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy5vx5W2fHwRAP\nnOl6rTBMEnlMx/q8Mdp8NPaARjeVWxvUmGi4HeQgyjkBqygLGUPm2qziG/Bx1LvO\nCgYlkRDK1ygY3VFCWqf2b8eAlQXigBRI64J04eLhGBNL8UsjP2XM9apBZGkSxXwE\ne8is1U2pzSRY8nzLN1KaI3WyefBuvOL0iggCzUI4pkK3qCUV6l3EM2tppWhszGZQ\nkqqvT+WLlgKBXZRgjPvpoPw/Nw6QhWdJc95OEKLb0jRttJetdO46RkYKq5iD1JJt\nMs9qdQXcxYIbpb58XADXgWeugW9DnGhQlxLeP/cjiKgNsOkW5N824oKP1AoAdQOm\n7wrwaRp3AgMBAAECggEADQNONAmZB+ecInaYaQr162KgnhwhudSqfsRfdb8lxeBl\nqtYXL+VEtbnf4aYweHYzATTAxIWhvLXrnzYNcmgV35s82GoowfnUI9HHoiu0zN/i\nGde/mn7fwN2+cZSwkXTIE9t+sdj655mjxrO2ShQN3R8F2M5yk1mH0ZxosD28ZmGJ\ni8xFGDoqY5PHcubDYkXqL912RJe6e8edHN2BdMNSUYlzva8QtRgGVfBGPeDnrQN0\nQxjXE617rEjEwUNmp340zATRUiT5tKwqDkaA+muN+thajLLN2oCSkrKhsq++VcV4\nh1num+diGJzWSwEMwdQAZnIbgJoyG87SMTS5MjcdeQKBgQDwmYiZUNFZDk+R3p6o\n5ipdqYrzyIO5o8k0q0FSyoKYb14ujE/8zJ2w5Kv2PLQb8CEd7lgJN4gtwH7aheRo\nqu7rZOfD6Fk+kgy5Sh6acRldNg5Gg3yKlqFYi0Zz8C8fV2Zb6x6OKODyRQaZWi+c\nmNP2pmMNgC6kpNbMOkc3KIpLGwKBgQC+Wnp7019+9KCHyFL9EhcUyps/1F0uWurD\n2iC5q/Fii45GLNxFrEbAXINhFMMzLm2P8fQjCUrJwSKkESfiYcydRRdVkCChfsG9\nniKV6UW6B4YFIx/Gb2ZJZBAvA5L4CaaKBCMUbN+HeVYGwwG24jv3M4LzYpQ6BQ2m\nNhkr9q6n1QKBgQCzjhEoQe0KJijxto73g1XIsneVeWX8y6Oj386PR7xwoGRMHsCu\n69EfK3i9+g178Bf262Hd9wh1BHxm/pc4GaDWIWbpiGPZ00sVmKAAKDmCm43Jx+TQ\n1JsypjX83hl8rVAhdvVFqHI/u42yMmDn4BIHt6Kid6/XhYEbxr5RBrs2UwKBgCRe\n0UxbhMGTKCEJi6HDFRnp5GP7xZoX0Qd+5AXV7pcvpw2NgMDnO9WBV7Dy8KEU2+ZH\nCqivG9UUy/OhO4ervBbInr7AfRueRpJeZqlSGvqCeX79yRJ3MooPTnBNNIWkAmgY\nhkNe0g7mhiNgmzFAZMjE1N6AFWZIlOUPLRwTVCfJAoGBAL4+RdyFzLJ+ncAAVZwG\nkQ6Jxmk7D5+d/tenlmW/7E+lJAdcCiQp/g0IUo/Kk3Rs8gEFDGXTZKga/+LXLFsE\nSfwtAYpFBwWWhOSM4VYE1W0GrKj6zEBv/SynOTuD9asJZeIHZd7Tp3ijQoKOMFVa\nKrnmKsC3F33ibbp2nL+eZ6x5\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-e5gdw@polar-32b0f.iam.gserviceaccount.com",
    }

};

const storage = new Storage(conf);

// const bucketName = 'gs://polar-32b0f.appspot.com/stash';
// const pathName = "16E7Z6tDWrt3Tveu2qyHEUraLK5Kx38rHiQhq8R2.pdf";

const bucketName = 'gs://polar-32b0f.appspot.com';
const pathName = "stash/16E7Z6tDWrt3Tveu2qyHEUraLK5Kx38rHiQhq8R2.pdf";

console.log({bucketName, pathName});

// const bucket = storage.bucket('stash');
const bucket = storage.bucket(bucketName);
const file = new File(bucket, pathName);

// https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/stash%2F16E7Z6tDWrt3Tveu2qyHEUraLK5Kx38rHiQhq8R2.pdf?alt=media&token=14a8aebc-7c8d-497f-b8ae-8b442c715d5a

async function test() {

    const action = "read";
    const expires = Date.now() + (5 * 60 * 1000);

    const opts: GetSignedUrlConfig = {
        action,
        expires
    };

    const signedURL = await file.getSignedUrl(opts);

    console.log(signedURL);

}


test().catch(err => console.error("failed: ", err))
