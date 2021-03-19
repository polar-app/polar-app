export interface TestResultWriter {

    write(result: any): Promise<void>;

}
