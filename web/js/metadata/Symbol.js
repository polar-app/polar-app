class Symbol {

    constructor(name) {
        this.name = name;
        Object.freeze(this);
    }

    toJSON() {
        return this.name;
    }

};

module.exports.Symbol = Symbol
