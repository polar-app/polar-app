// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');

const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIEowIBAAKCAQEAgfaWHyEEciv1JUPke4AjsYS39vsdloKH+GRvf5A9hn/In214\n" +
    "B/kvyCb2PMDa+IVvuMsirCacGhUkfsCSqVPH0DUrabsFd5tFrL4mVeKEEQwtmCrH\n" +
    "/azoekEjkyaVZSZ6qJzfcShnEmbP5p0ztzyXTPoczMc6dp3IWh3vTSdgfv28p7iD\n" +
    "6EndtqyH1CDxM+EgnU5ROpkjkePSVnMS98zzHefl8x1sHD17Ag7ZRBQvPIQuYNyI\n" +
    "jdLOEcxCze7ZSgqkS2+V3Bc4nl1My9jiug+AlDdcXJjPMXJbGtXB/KnWG/XOZnSW\n" +
    "ce0sK0KcFceMQvv2xvjgDrhL4f2vvw6Dn/koSQIDAQABAoIBAB5UK0hsbhsuwvDF\n" +
    "XUas6qd8r2nFxGvhXlXLKnH8eT8wBuOdqktCDbKJ1SDsaK1ihmX7kcXW5Mr5cCDc\n" +
    "U92MHa8rGUx9RpNY+vOLFGsqh2NrEiDWqwE6Hq6ZEPJAKNEIH8vFgCdqJFOZBp9s\n" +
    "xCrYyv49yAbJ34za2WyeW8AHlm9L8bR3scWgW5pXUCzSzzNxWvBzZ1nKzGux3pOu\n" +
    "bJGwhCcFVK4BXZnPX9Src1hk7RTOF0/olPNGnjWTQ8S4AYA1ufh5KhrT6+9ACaUN\n" +
    "9GnzTQzkJxnuByDG8o7YmIyArQobvMqzbD9ICwk4+c95ZvXsO78ZlFzpDrgRb1HJ\n" +
    "l+nkHeECgYEA/Zh9Ggh3ZXZMal9rbxRmTyCdAtl9jZ5W1CoB29E9xYRc3JVb5huC\n" +
    "A2sPwrIV+r8QTtC7IMSag4BwDnQbhOWOBbCWanUv2TBrA3M0nrJ/oEPIs0ZLdwz4\n" +
    "E7CBWvBSKLv5OuidLAQLmCHNtTEMBias7kcu5gTUEATj3uC22ngMxt0CgYEAgzIG\n" +
    "YbedJ0q88Er632LcKd691HgJgSdeWsdswj8UdBO1wivfyx0SNmi1o5QqGjcHzpcP\n" +
    "4enEVb73A5Ms+lXWM5MyT0GTiHyCbJzoiNw2vkPB/D44tGRiYyvgHOlOCyGjnLlT\n" +
    "qstHE2V8N1Tk7Yhrhx7795YrriteL8GA17s48l0CgYAWlBwXVEelHfpBwksjcbKG\n" +
    "OwYfudOG52EdtLvDoYaZbmaCMT4kZ7CUs1SM5iQ01gwSqFzw1vBW4vmXH9lPZMzX\n" +
    "Ttilk9d1w+zTOs+ljYj1cPOOmqSfbeUsg5uQyDLYc5wGFa3gvF935RKWnk5OweTF\n" +
    "tkrDqgxjfLv5HRLKssOYdQKBgAle5FfMbpwk2XPsVxjnjcQr1bE8Val072dagSkq\n" +
    "qkJUOhJBYf22+NsMBZVGeu9eaN9XqNnBAbYCKtCFjZvfz6nlZJ2GmIwSIJqzZmSI\n" +
    "Hhze6BclNpWj6ecddid6fomLAI2sKw6y8EOxZvroxGU27j87dlHL1xjcniCZGKPQ\n" +
    "CpQ9AoGBAJxfKEkIApyzuQE1tdi4ePuTSozF4Dbgvxh+s+5ocrDPkb/sTLI977tR\n" +
    "Ca0bfQkT4zZiI9hzVAICt6XEZ9+892mIXDuObXJ9EU6dqq/S7Tmc+WFFtuSO81q1\n" +
    "WUxe8jc1MCP9SdBsHKjyIaGmJ6RyCezOdN60b69l5mTSgN4yGO/m\n" +
    "-----END RSA PRIVATE KEY-----\n";

export namespace AdobePDFExtractor {

    // API reference: https://opensource.adobe.com/pdfservices-node-sdk-samples/apidocs/latest/
    export async function extract() {

        try {
            const credentials =  PDFServicesSdk.Credentials
                .serviceAccountCredentialsBuilder()
                .withClientId("a0ef3a1c1a3941bca7023ab36b95e010")
                .withClientSecret("p8e-7Cs7_kABgIJiDLFNKfrtJ_DALsrwz3b8")
                .withOrganizationId("7D253A486161D8460A495FBF@AdobeOrg")
                .withAccountId("7C3539706161D8660A495EE3@techacct.adobe.com")
                .withPrivateKey(PRIVATE_KEY)
                .build();

            // Create an ExecutionContext using credentials
            const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

            // Build extractPDF options
            const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
                .addElementsToExtract(
                    PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT,
                    PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES
                )
                .getStylingInfo(true)
                .build()

            // Create a new operation instance.
            const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
            const input = PDFServicesSdk.FileRef.createFromLocalFile('/Users/burton/astronomy.pdf',
                                                                     PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf);

            // Set operation input from a source file.
            extractPDFOperation.setInput(input);

            // Set options
            extractPDFOperation.setOptions(options);

            const result = await extractPDFOperation.execute(executionContext);
            result.saveAsFile('/tmp/ExtractTextTableInfoWithStylingInfoFromPDF.zip')

        } catch (err) {

            if(err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }

            console.log('Exception encountered while executing operation', err);

        }
    }

}
