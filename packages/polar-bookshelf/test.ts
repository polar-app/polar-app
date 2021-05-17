



interface Success {
    readonly code: 'ok';
    readonly value: string;
}
interface Error {
    readonly code: 'invalid-challenge' | 'invalid-email';
    readonly foo: string;
}

interface HttpStatusError {
    readonly code: 'http-status-error';
    readonly responseCode: number;
    readonly responseText: string;
}

interface HttpError {
    readonly code: 'http-error';
}

async function callCloudFunction<S,E>() {

}

const response = await callCloudFunction<Success, Error>();

switch (response.code) {

    case 'ok':
        break;

    case 'invalid-challenge':
    case 'invalid-challenge':
        break;

}
