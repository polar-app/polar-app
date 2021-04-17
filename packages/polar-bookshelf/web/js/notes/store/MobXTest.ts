import {action, computed, makeObservable, observable} from "mobx"

describe('MobX', function() {

    it('basic', () => {

        const observable = makeObservable({hello: 'world'});

        console.log(observable);
        console.log(observable.hello);

    });

});

class Hello {

}
