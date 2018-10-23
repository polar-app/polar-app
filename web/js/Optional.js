// simple optional implementation so we don't need to resort to jquery

// TODO: ORPHAN JS.. remove after TS conversion.

class Optional {

    constructor(value) {
        this.value = value;
    }

    map(fn) {
        if (this.value !== undefined) {
            return new Some(fn(this.value));
        }
        return None;
    };

    filter(fn) {

        if(fn(this.value)) {
            return new Some(this.value);
        }

        return None;

    }

    getOrElse(value) {
        if (this.value !== undefined) {
            return this.value;
        }

        return value;
    };

    static of(value) {
        return new Optional(value);
    };

}

var None = new Optional();

var Some = function(value) {
    if (typeof value !== undefined) {
        return new Optional(value);
    }
    return None;
};

module.exports.Optional = Optional;
