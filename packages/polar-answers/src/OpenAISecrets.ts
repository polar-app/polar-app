export namespace OpenAISecrets {

    export function init() {

        function defineSecret(name: string, value: string) {

            if (! process.env[name]) {
                process.env[name] = value;
            }

        }

        defineSecret('OPENAI_API_KEY', 'sk-pYHAElnbhpnfcoN8rqbMK0gCmXLHUzpFvOwRaFtD')

    }

}
