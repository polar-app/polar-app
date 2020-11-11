"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseTesting = void 0;
class FirebaseTesting {
    static validateUsers() {
        const validateEnv = (name) => {
            if (!process.env[name]) {
                throw new Error(`${name} is not defined`);
            }
        };
        validateEnv('FIREBASE_USER');
        validateEnv('FIREBASE_PASS');
        validateEnv('FIREBASE_USER1');
        validateEnv('FIREBASE_PASS1');
        validateEnv('FIREBASE_USER2');
        validateEnv('FIREBASE_PASS2');
    }
}
exports.FirebaseTesting = FirebaseTesting;
//# sourceMappingURL=FirebaseTesting.js.map