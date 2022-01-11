import {action, autorun, createAtom, IAtom, makeObservable, observable} from "mobx";

describe("BlockAutoRun", function ()  {
    it("basic", () => {

        class Cat {

            private atom: IAtom;

            private _id: string = '101';

            @observable
            public _name: string = 'Alice';

            private _observable: boolean = false;

            constructor() {
                this.atom = createAtom(this._id, () => this.convertToObservable())
            }

            public get name() {
                this.atom.reportObserved();
                return this._name;
            }

            @action
            public setName(name: string) {
                this.atom.reportObserved();
                this._name = name;
            }

            protected convertToObservable() {
                if (! this._observable) {
                    makeObservable(this);
                    this._observable = true;
                }
            }

        }

        const cat = new Cat()

        const disposer = autorun(() => console.log(cat.name))

        cat.setName("Bob")
        disposer()

    });

})
