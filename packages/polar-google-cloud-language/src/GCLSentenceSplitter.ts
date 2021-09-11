import path from 'path';
import language from '@google-cloud/language'
import {DiskEnvCredentials} from "polar-shared/src/util/DiskEnvCredentials";

const DEFAULT_CREDENTIALS = {
    "type": "service_account",
    "project_id": "polar-32b0f",
    "private_key_id": "ab9aaad6eac62ffd5f27fdd42de1b303ee824215",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQVXWNk6xkV755\nHq24BltgW5Gu4oHEOV4qPCCtQdjn4tjqTJkQlE9qAHq2Fo6mYPplsc1oxm5Rnekc\n/gjFg/dwiKWQKkobwTgMDQSSebToxAWF8aj6q6ZyKUC4aau0o/FPL7kKv4b5kO5v\nibqJPstro/TjbudYCBRSS0vEtJHPlMMR+VFf44VhHgMTIuChMBirI3o0rkYQjTD/\nYaTj7wqLrTk3dGwpcGqmzJcCd471HpidQXuC9Y/toKmTaqL8l9rlm0p2zh953HIb\nQP38WvkmcxHKJNZoLUCi8mrPPSD2oNvUL7fIyAW5qFss5YFM1HEItyX8AKxQ7L8Q\nVuYMI3GHAgMBAAECggEAAefeOOrSZ2KUF/iLX0UTneiIhyCETl61+U3ugJc7HDfr\ngw0rU0cACPizJqpDKMt3TunW9q/l/3Ih2UWLn/7qiwl89jokzmcwk4+k7JAXcw+j\n+0swIAbk8WNmN6mjy/W59d76YtpIqkzEmZmZbrr30mbADTqM/DWqtewBZ+287biq\n6an515LJjvHNheu7s6+jPzo603e2peUq+hQ+nwzTCg+g/E5Ce0E3O5pzBZ27QXMT\nC9h4CuXWmheWbjAmNzfJY/pkqtkC5E+P14mNGgI6Wk+nFmqhSjn3BszLOSfjCJwe\n/YWxsBqE8EuIYoQNe8g4ko3lZ3gHO9hbOVirrtdbFQKBgQD4VPpZvFhyLC+c6iZh\n1RqVj2/a3el+a2iVH5KrYaX4J9P4gOGvc14xogDt2WmDutnbEW0Ld8k3yQZC8fEH\nLftl1g55XNd6iGFumtBbHo3hHm/qx7pqoO0SExt6Ml5k587xPcJPkhEiuRwoitKk\ntLJj/F5pzsWhrfFG9UgVLCW4AwKBgQDWxE2Jciq5pYLNnhgzCQDUg3pg6MsixJuW\n26g+WOMwVJ4XGz7rCXhJUqY+Kcz6SG7NzqcB7cJxXfTrh9HUcbuVZsFHSKVoYc6l\nFl7a/oqJmkPjuU1LmXNRCZ4izzYxfZD3VkuVIzJHN9v5ZC6eUczsDMl8m6UR8zlb\nn0QuY0izLQKBgQCTVb+vK/sBykt5esbI9qmuIIsJvO3CrrE/AJuBiQ7ye5bc8oJ0\nGSvCoM6ST5K1sE9/FQiwbCJ7MY7Ae1E4pERquCSgRsAll/LOr5V86lTdQrS+BEAK\n8W2WcrWzu1yb25jBMpYtpYj7I/6b4zl0tSy9+8Z8WkyRT2U+Z1qcDTRXxwKBgCwQ\nHnBisg1gvdN96i0eXcM8LnGPkY3SlLGA46XXCtWxprXK6z/Bs6IniOAcJ2f6UHF9\nQpqMs2YbBtMEDLLvmrLuYB1F9FnUJ1eLnW6E5tuQgPlJ3WfzVct8k6tEpDPHNWTp\nmZxBmmEuPr2OJlppIggUH4qnTFjAdDYuGQkDabkJAoGAFK8oV0TZ8JhJXanf8D+n\nQP82AMg6hIQHrOnAq4qHLaLgQ+6pRw6n8Ini4ueqKLcmUa5A1EHd4gbPV01uZkMx\n5KNKWFzjMM8pSMvsKiNQSHBVx4mEfN8rwM9xQW2ySLnuSOtAP+dgWSG+mPAqXyKA\n//U5mQuDOWvWWJFhS5wbhVg=\n-----END PRIVATE KEY-----\n",
    "client_email": "natural-language@polar-32b0f.iam.gserviceaccount.com",
    "client_id": "114865423106954101643",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/natural-language%40polar-32b0f.iam.gserviceaccount.com"
};

process.env.GOOGLE_APPLICATION_CREDENTIALS=DiskEnvCredentials.write('GOOGLE_CLOUD_LANGUAGE_CREDENTIALS', DEFAULT_CREDENTIALS);

export namespace GCLSentenceSplitter {

    export async function split(text: string): Promise<ReadonlyArray<string>> {
        // Imports the Google Cloud client library

        // Instantiates a client
        const client = new language.LanguageServiceClient();

        const document: any = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // TODO: don't call analyzeSentiment - we just need to split and don't
        // care about sentiment at all.

        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;

        if (sentiment) {
            return (result.sentences || []).map(current => current.text?.content || '');
        }

        return [];

    }

}