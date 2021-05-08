export class CloudFunctions {

    public static createEndpoint() {
        const project = process.env.POLAR_TEST_PROJECT || "polar-32b0f";
        return `https://us-central1-${project}.cloudfunctions.net`;
    }

}
