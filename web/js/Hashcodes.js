
const base58check = require("base58check");
const createKeccakHash = require("keccak");
const {Preconditions} = require("./Preconditions");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 *
 * @type {Hashcodes}
 */
class Hashcodes {

    static create(data) {
        Preconditions.assertNotNull(data, "data");
        return base58check.encode(createKeccakHash('keccak256').update(data).digest());
    }

    /**
     * Create a hashcode as a truncated SHA hashcode.
     * @param obj {Object} The object to has to form the ID.
     * @param [len] {number} The length of the hash you want to create.
     */
    static createID(obj, len = 10) {

        let id = Hashcodes.create(JSON.stringify(obj));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0,len);

    }

};

module.exports.Hashcodes = Hashcodes;
