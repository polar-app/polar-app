import {Batcher} from './Batcher';

describe('Batcher', function() {

    it("Basic", async function () {

        let mockExecutor = new MockExecutor();

        let batcher = new Batcher(mockExecutor.execute);



    });

});

class MockExecutor {

    public resolve: () => void = () => {};
    public reject: (err: Error) => void = () => {};

    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }

}
