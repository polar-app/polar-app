declare var window: any;

export class TestResult {

    /**
     * The current result that we have. Null means that we have no result. If you
     * need to store a null result wrap it in an object with a 'value'.  We make this
     * a global value so that spectron can easily read it.
     */
    static set(value: any) {
        window.TEST_RESULT = value;
    }


    static get(): any {
        return window.TEST_RESULT;
    }

}
