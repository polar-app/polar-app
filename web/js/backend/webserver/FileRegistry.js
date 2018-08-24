"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../Preconditions");
const Hashcodes_1 = require("../../Hashcodes");
const path = require('path');
class FileRegistry {
    constructor(webserverConfig) {
        this.registry = {};
        this.webserverConfig = Preconditions_1.Preconditions.assertNotNull(webserverConfig);
        this.registry = {};
    }
    registerFile(filename) {
        let key = Hashcodes_1.Hashcodes.create(filename);
        return this.register(key, filename);
    }
    register(key, filename) {
        filename = path.resolve(filename);
        let reqPath = "/files/" + key;
        this.registry[key] = filename;
        console.log(`Registered new file at: ${reqPath} to ${filename}`);
        return { key, filename, url: `http://127.0.0.1:${this.webserverConfig.port}${reqPath}` };
    }
    hasKey(key) {
        return key in this.registry;
    }
    get(key) {
        if (!this.hasKey(key)) {
            throw new Error("Key not registered: " + key);
        }
        return {
            key,
            filename: this.registry[key]
        };
    }
}
exports.FileRegistry = FileRegistry;
//# sourceMappingURL=FileRegistry.js.map