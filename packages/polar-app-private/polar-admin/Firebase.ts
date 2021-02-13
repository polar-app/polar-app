import * as admin from "firebase-admin";

interface AppConfig extends admin.ServiceAccount {
    readonly databaseURL: string;
}

export const CONFIG_MAIN: AppConfig = {
    projectId: "polar-32b0f",
    clientEmail: "firebase-adminsdk-e5gdw@polar-32b0f.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDAFgh2xuFqCZzq\nNTTOJ61FI6YWFyniCYDmyxA7uVwy8TPI9LCQBlwAFsPTjQVwi/5lcEd+9C/S9qAj\n2j4jzWis0Joeaqqrm0R5YyiwWmVHxGAAsHeD9YYzLW3UI0jxzzycUQp5SlQIp6qh\ncaAGuwWFg9Etz3TjgtVyFpe6r3wqqdUFI4Q98yAsDfcCYjBiOND3q/ya2sr8Ukso\nfvnVWPUqU+zZbhAwZ3zUV2POTTSp0NZwvjDnOrvq2OfLzMwoRNm0tzYrNtv/DMHT\ne2q+ivKaa6CSG9RfO3yBZAp4rEIqgJS8x7AUKnSskJUiuhedUlMc0ZwEvd/qeb7E\nwNBPWpa5AgMBAAECggEAJLjRm2uAEpaN4hST6MmbDXm4Ocbp4eWxN+4gR1qzbqXA\nIa3tx0r/8aBohZwTKyYIV3o0oOer8OfnS5Ngh9WwKkGjBSedQztmxtIXKEfPzv2S\n4O7bmmWo50XLFmA8hMX6r2Oq3e9Ay3rKWxzu2/qLHrBJoDll/ky345zAGxeLZFhI\nf9XPunT9z71rmnPOwpB0YInAuVGY/NpnmR5f3neCs9JG5nduRXPF2jmxURFG1uaK\nIaPf5Wudu/aXxOInCJboDRZGgLDzhglwVpsgde9p4VYoPbbc0kparcXqWV0kUjGP\njSWr5nfBtW65yR58uSLm6mgJxqDONnBMeNH0p3i+NQKBgQDtGvthdhUxs35fnVQQ\nR8fXxeDHp/UmFCbpYxdKRhMYnO0DsJ6ZYlofZrQ5u2HTJmxbAIrBfUnBfyvc5Djk\nS5edJtungCYAvf/aWhDZ6FNbjV70+HSkALPwl7N0DpnBz6IJtsRVxWWd03uL0VR1\nfwzQVuhdPFurTNWJ+Z12uN/3xwKBgQDPZKTTEVPsnfffUfE6uCf4DOkIdzEIwHX+\nFxhYpIPZvw26ajVYq1DeNwfDbOm1FDYEjsnUHr0ocYNTH8TdKR3EJR0NWduAp/2X\nrx/Cu18MlZmKkDYK7wE5KIIE6HqM9HvmUoIYXm1iVmLrxo1L0ZNBfBGTUbg64jPp\nFpt74qn9fwKBgQDW9sR8GwuiEOL9Gu1xCTMU3FErkon+6PxSUkV2UEvV38g+tS1F\nUNb2ay3wvYM2ZTqN0tL6E3YAGSUSUlOGH0ao8uboWJWbzKafN1LZzPluIqC5plxR\nqFV7Rn4rNWWPQojdF7evL5UuXuM+4x0YnYRnirOGfEd76eAcBJQPZBOiVwKBgQDO\n0tKg/x3P0bWZSzGj2nVZpR5cZ+lJjg3diJCqDd7Drwl0x2hN9gMeqIigdqQXBoHc\nR721QbZod9N8eSktWUyrCEwRvXPuuRloRKgK3isq9KH7kleizblNlD0dwe49Va+e\nANhmjvzM3dOmyAqu+uC8pIsufIeaiW01XWtPv7rA5wKBgQCYuWUUiAg3OGyEwfY0\nrw9UjDWPz8sBusoral6Ixbx84h/E/fyGgRiS3tirJ6v6mvv20gMt5oEH0Pm8TWrs\nAlpx4zGvZ0+72ABBwf21jmdz0+yRFdHPQjYjG3302xXRvO5qAU2LV7xYiy45Y4t/\nG0E1LtcBAyes8LfL1tE9FmDw6w==\n-----END PRIVATE KEY-----\n",
    databaseURL: "https://polar-32b0f.firebaseio.com"
};

export const CONFIG_TEST: AppConfig = {
    projectId: "polar-test2",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq2kd7DkEfK5aY\nhszTDJCO0+goukYt01sSXEpNwwf7HeXIxI44TnMWCV84hCT+zS2TpBBdTYbBEaFF\nS1oPZxSBMSYazsBrrJDsvjflK2bdeF2KW2VSfpUtTieoyS7betFmcdMjj11Fb3DS\nw2rFf2qVCzRKbkHOHQCdqLoduTd4sCX5YfcHO01yvJj5JQkcaD9TtpZ0rNpwGT/K\n8eK+VE3yQR/xpkwiVXBqj5aALsXy8QJr+xmSoV6g/hZDpEsjJJwb6T/xIm23afO5\nUyAWASeq3nAy9wyde/qXqEBQRqAkGdlHn2u++tbZaWj/X7zYx6e8jBY1GEZfYS7n\nmzpUlPZhAgMBAAECggEAIvxfd6p48w7IQXKbYrlVc6GHzUFqoPsCbyrGeu0Z7EPY\n7l6xnRu6s0a0I7Qz2q1wI7VmJrAc6fgZYTxHb1H40QIkXgv8yE2NzWbM5tvfWBDN\nRoY1AuQOjxA8gj1uOI4EUdGVFZAO4gAm+47XAhLoKsnfgVMJhI33gIUZLMJhzB2Q\nhgnZM2eOmnEiICIiy6YR3RDuvq1NpB6FTxWxnIFH2IlhTkxIdHLgqPLsubXWpTV+\nkVTfvnlLRCBe8scELt50GkKTQLflvuaSgRBxP39z0nDMxV+suAUYwKi3owKl/xW/\n/VET+0gLwKGy/8vafYwx17Ay4IPM528KFNdvUmvKjQKBgQD7vNNRlrT7CsONvvwA\nsSzCrU75T6uf3Ntp2ACf7qM4mFR9fuEy7TM+h0SR10s4HopiH1SPF4SV35xqv7YQ\nHsaodXtjClXOpSCp1C6Bl5N0rq8FfYllkc3XLwI5tY46n30E8QU96GGFAcUKdyW/\nof74IDuv7WopFfeEjnbxyFXcFwKBgQDu1EPHGevuB8ypi5jlPD8/1sMvISzaW4r+\nhh+TdpgVzUQ+mwEgNzj6fIrFZZ23i/k8c+R5WWQCK1oXC64RU/VoV9Ng/11nb0/H\n7MZe/LFQ3gOlzqr7aHTga1z9xl8cwq94j7ytvLD/LLFOXeH7f8Q31Yc2uMgddtRs\n94guzVn0RwKBgHsvjaERRILMY6FLYfncuXCSamDpsaxK4TvMLZIVrt2U/VNj8UOA\ne2EPxGgxmGdf2ovllPVopsLIZ7x9D9SXmtL4mmZ+ujqi53bzk8ZqrAefK5peMgv3\n62hvYoFm7LCXNxBh+RSwUHhLw2Y5o8lAtoopC8wtO5PbYgIFzQLH6+wFAoGBAJTI\n8CCNaYm0mi/Vo77LtauTo60swcCW3xSJggpgC4cphaZq8lybioeiJuGq2IKMVQzw\nNhnTMpaXY1yQDjUFVRFYBXucGxhhJBaszzhFvEFgzmzxP1u4S3ez6w6+Emrcbmxx\nP14M+0c9FIh5vFrt0dPm1oGkxCZ27QelfdWKYMvpAoGABqGlwoLwcDvXx2thOQX4\nBYPAur5Ge3OtvGuP0AADZZe5m7t1DHTE42JnoRstYCbx1dffzd+ZYbIFixc9wi6q\n3SIAf+sfVSO9JN1oBx6AEt2HSv6OiYToz4edePVov14kv00QrL6VOmTfC3Xdss1R\nMzQIdCYhpvlQOOMNSW2dUMs=\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-b7l64@polar-test2.iam.gserviceaccount.com",
    databaseURL: "https://polar-test2.firebaseio.com"
};

export class Firebase {

    public static getApp(config: AppConfig = CONFIG_MAIN) {

        const app = admin.initializeApp({
            credential: admin.credential.cert(config),
            databaseURL: config.databaseURL
        });

        return app;

    }

}
