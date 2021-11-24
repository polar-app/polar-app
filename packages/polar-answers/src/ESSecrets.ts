type ES_CREDENTIALS = {
    ES_USER: string;
    ES_PASS: string,
    ES_ENDPOINT: string,
}

const ELASTIC_CO_CREDENTIALS: ES_CREDENTIALS = {
    ES_ENDPOINT: 'https://polar-search0.es.us-central1.gcp.cloud.es.io:9243',
    ES_USER: 'elastic',
    ES_PASS: 'JLtiXsMuEEwX1qQjJTAiOSHQ',
}

const AWS_ELASTICSEARCH_CREDENTIALS: ES_CREDENTIALS = {
    ES_ENDPOINT: 'https://search-polar-m-elasti-7da1alsug7eb-ark26m65fe3ke5q4xpbl647jfa.us-east-1.es.amazonaws.com',
    ES_USER: 'admin',
    ES_PASS: 'IW+,5H7,0B;Zbc$vJg4Q/-6t1Sje_J2H'
};

// Easily swap between ES credentials by changing this line
const CREDENTIALS: ES_CREDENTIALS = AWS_ELASTICSEARCH_CREDENTIALS;

export namespace ESSecrets {

    export function init() {

        function defineSecret(name: string, value: string) {

            if (!process.env[name]) {
                process.env[name] = value;
            }

        }

        defineSecret('ES_USER', CREDENTIALS.ES_USER)
        defineSecret('ES_PASS', CREDENTIALS.ES_PASS)
        defineSecret('ES_ENDPOINT', CREDENTIALS.ES_ENDPOINT)
    }

}
