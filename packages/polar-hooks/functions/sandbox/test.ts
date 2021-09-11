import * as admin from 'firebase-admin';

const rawServiceAccount = {
    "type": "service_account",
    "project_id": "polar-32b0f",
    "private_key_id": "133e7ab5f937696d8d325f6c099e2b6c121899bb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy5vx5W2fHwRAP\nnOl6rTBMEnlMx/q8Mdp8NPaARjeVWxvUmGi4HeQgyjkBqygLGUPm2qziG/Bx1LvO\nCgYlkRDK1ygY3VFCWqf2b8eAlQXigBRI64J04eLhGBNL8UsjP2XM9apBZGkSxXwE\ne8is1U2pzSRY8nzLN1KaI3WyefBuvOL0iggCzUI4pkK3qCUV6l3EM2tppWhszGZQ\nkqqvT+WLlgKBXZRgjPvpoPw/Nw6QhWdJc95OEKLb0jRttJetdO46RkYKq5iD1JJt\nMs9qdQXcxYIbpb58XADXgWeugW9DnGhQlxLeP/cjiKgNsOkW5N824oKP1AoAdQOm\n7wrwaRp3AgMBAAECggEADQNONAmZB+ecInaYaQr162KgnhwhudSqfsRfdb8lxeBl\nqtYXL+VEtbnf4aYweHYzATTAxIWhvLXrnzYNcmgV35s82GoowfnUI9HHoiu0zN/i\nGde/mn7fwN2+cZSwkXTIE9t+sdj655mjxrO2ShQN3R8F2M5yk1mH0ZxosD28ZmGJ\ni8xFGDoqY5PHcubDYkXqL912RJe6e8edHN2BdMNSUYlzva8QtRgGVfBGPeDnrQN0\nQxjXE617rEjEwUNmp340zATRUiT5tKwqDkaA+muN+thajLLN2oCSkrKhsq++VcV4\nh1num+diGJzWSwEMwdQAZnIbgJoyG87SMTS5MjcdeQKBgQDwmYiZUNFZDk+R3p6o\n5ipdqYrzyIO5o8k0q0FSyoKYb14ujE/8zJ2w5Kv2PLQb8CEd7lgJN4gtwH7aheRo\nqu7rZOfD6Fk+kgy5Sh6acRldNg5Gg3yKlqFYi0Zz8C8fV2Zb6x6OKODyRQaZWi+c\nmNP2pmMNgC6kpNbMOkc3KIpLGwKBgQC+Wnp7019+9KCHyFL9EhcUyps/1F0uWurD\n2iC5q/Fii45GLNxFrEbAXINhFMMzLm2P8fQjCUrJwSKkESfiYcydRRdVkCChfsG9\nniKV6UW6B4YFIx/Gb2ZJZBAvA5L4CaaKBCMUbN+HeVYGwwG24jv3M4LzYpQ6BQ2m\nNhkr9q6n1QKBgQCzjhEoQe0KJijxto73g1XIsneVeWX8y6Oj386PR7xwoGRMHsCu\n69EfK3i9+g178Bf262Hd9wh1BHxm/pc4GaDWIWbpiGPZ00sVmKAAKDmCm43Jx+TQ\n1JsypjX83hl8rVAhdvVFqHI/u42yMmDn4BIHt6Kid6/XhYEbxr5RBrs2UwKBgCRe\n0UxbhMGTKCEJi6HDFRnp5GP7xZoX0Qd+5AXV7pcvpw2NgMDnO9WBV7Dy8KEU2+ZH\nCqivG9UUy/OhO4ervBbInr7AfRueRpJeZqlSGvqCeX79yRJ3MooPTnBNNIWkAmgY\nhkNe0g7mhiNgmzFAZMjE1N6AFWZIlOUPLRwTVCfJAoGBAL4+RdyFzLJ+ncAAVZwG\nkQ6Jxmk7D5+d/tenlmW/7E+lJAdcCiQp/g0IUo/Kk3Rs8gEFDGXTZKga/+LXLFsE\nSfwtAYpFBwWWhOSM4VYE1W0GrKj6zEBv/SynOTuD9asJZeIHZd7Tp3ijQoKOMFVa\nKrnmKsC3F33ibbp2nL+eZ6x5\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-e5gdw@polar-32b0f.iam.gserviceaccount.com",
    "client_id": "113273583866110264922",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e5gdw%40polar-32b0f.iam.gserviceaccount.com"
};

const serviceAccount: admin.ServiceAccount = {
    projectId: rawServiceAccount.project_id,
    clientEmail: rawServiceAccount.client_email,
    privateKey: rawServiceAccount.private_key
};

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://polar-32b0f.firebaseio.com"
});

const firestore = app.firestore();

async function withTimer<T>(delegate: () => Promise<T>) {

    const now = Date.now();

    try {
        return await delegate();
    } finally {
        const after = Date.now();
        const duration = after - now;
        console.log("duration: " + duration);
    }

}

async function getDocToken(token: string): Promise<DocToken | undefined> {

    const docTokenRef = firestore.collection("doc_token")
        .doc(token);

    const snapshot = await docTokenRef.get();

    if (snapshot.exists) {
        return <DocToken> snapshot.data()!;
    } else {
        return undefined;
    }

}

async function writeDocToken(docToken: DocToken): Promise<void> {

    const ref = firestore.collection("doc_token")
        .doc(docToken.id);

    await ref.set(docToken);

}

async function handleData() {

    const docToken: DocToken = {
        uid: "TTEs2Drp18f59zfEc0P3ifBobP92",
        id: 'foo',
        url: ''
    };

    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));
    await withTimer(async () => await getDocToken(docToken.id));

    await withTimer(async () => await writeDocToken(docToken));

    console.log("dnoe");

}

export type DocTokenStr = string;

interface DocToken extends UIDDoc{

    readonly url: string;

}


/**
 * A simple doc in firestore that has a UID.
 */
export interface UIDDoc {

    // the owner of this record.
    readonly uid: UserID;

    readonly id: string;

}

export type UserID = string;

handleData().catch(err => console.error("Failed to handle data: ", err));
