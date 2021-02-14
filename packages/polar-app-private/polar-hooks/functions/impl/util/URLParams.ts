export class URLParams {

    /**
     * Create a JSON encoded param.
     */
    public static encodeURIComponentAsJSON(obj: any) {
        return encodeURIComponent(JSON.stringify(obj));
    }

}
