export class Segments {
    public static getInstance(): any {
        return require('@segment/analytics.js-core');
    }
}
