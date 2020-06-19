export class Symbol {

    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    toJSON() {
        return this.name;
    }

}
