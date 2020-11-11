"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTagsDB = void 0;
const PREFS_KEY = 'userTags';
class UserTagsDB {
    constructor(persistentPrefs) {
        this.persistentPrefs = persistentPrefs;
        this.backing = {};
    }
    register(tag) {
        this.backing[tag.label] = tag;
    }
    delete(id) {
        return delete this.backing[id];
    }
    rename(id) {
        delete this.backing[id];
        this.backing[id] = {
            id,
            label: id
        };
    }
    registerWhenAbsent(tag) {
        if (this.backing[tag]) {
            return;
        }
        this.register({ id: tag, label: tag });
    }
    tags() {
        return Object.values(this.backing);
    }
    init() {
        const json = this.persistentPrefs.get(PREFS_KEY);
        if (json.isPresent()) {
            const persistedUserTags = JSON.parse(json.get());
            this.backing = {};
            for (const persistedUserTag of persistedUserTags) {
                this.backing[persistedUserTag.id] = persistedUserTag;
            }
        }
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Commit of UserTagsDB: ", Object.assign({}, this.backing));
            const persistedUserTags = Object.values(this.backing);
            const json = JSON.stringify(persistedUserTags);
            this.persistentPrefs.set(PREFS_KEY, json);
            yield this.persistentPrefs.commit();
        });
    }
}
exports.UserTagsDB = UserTagsDB;
//# sourceMappingURL=UserTagsDB.js.map