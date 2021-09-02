export namespace ESSecrets {

    export function init() {

        function defineSecret(name: string, value: string) {

            if (! process.env[name]) {
                process.env[name] = value;
            }

        }

        defineSecret('ES_USER', 'elastic')
        defineSecret('ES_PASS', 'JLtiXsMuEEwX1qQjJTAiOSHQ')
        defineSecret('ES_ENDPOINT', 'https://polar-search0.es.us-central1.gcp.cloud.es.io:9243')

    }

}
