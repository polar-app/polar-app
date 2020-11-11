"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FirebaseDatastores = void 0;
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const CloudFunctions_1 = require("./firebase/CloudFunctions");
const Firebase_1 = require("../firebase/Firebase");
const firebase = __importStar(require("firebase/app"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class FirebaseDatastores {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            log.notice("Initializing FirebaseDatastores...");
            this.user = Firebase_1.Firebase.currentUser();
            const formatUser = (user) => {
                if (user) {
                    return `${user.displayName}, uid=${user.uid}`;
                }
                return 'none';
            };
            log.notice("Initializing FirebaseDatastores...done", formatUser(this.user));
            firebase.auth()
                .onAuthStateChanged((user) => this.user = user || undefined, (err) => {
                log.error("Unable to handle user: ", err);
                this.user = undefined;
            });
            this.initialized = true;
        });
    }
    static computeDatastoreGetFileURL(request) {
        const endpoint = CloudFunctions_1.CloudFunctions.createEndpoint();
        return `${endpoint}/datastoreGetFile/?data=` + encodeURIComponent(JSON.stringify(request));
    }
    static computeStoragePath(backend, fileRef, uid = FirebaseDatastores.getUserID()) {
        const ext = FilePaths_1.FilePaths.toExtension(fileRef.name);
        const suffix = ext.map(value => {
            if (!value.startsWith('.')) {
                value = '.' + value;
            }
            return value;
        })
            .getOrElse('');
        const settings = this.computeStorageSettings(ext).getOrUndefined();
        let key;
        if (fileRef.hashcode) {
            key = {
                uid,
                backend,
                alg: fileRef.hashcode.alg,
                enc: fileRef.hashcode.enc,
                data: fileRef.hashcode.data,
                suffix
            };
        }
        else {
            key = {
                uid,
                filename: fileRef.name
            };
        }
        const id = Hashcodes_1.Hashcodes.createID(key, 40);
        const path = `${backend}/${id}${suffix}`;
        return { path, settings };
    }
    static computeStorageSettings(optionalExt) {
        const PUBLIC_MAX_AGE_1WEEK = 'public,max-age=604800';
        const ext = optionalExt.getOrElse('').toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg') {
            return Optional_1.Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/jpeg'
            });
        }
        if (ext === 'pdf') {
            return Optional_1.Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'application/pdf'
            });
        }
        if (ext === 'png') {
            return Optional_1.Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/png'
            });
        }
        if (ext === 'svg') {
            return Optional_1.Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/svg'
            });
        }
        return Optional_1.Optional.of({
            cacheControl: PUBLIC_MAX_AGE_1WEEK,
            contentType: 'application/octet-stream'
        });
    }
    static getUserID() {
        const app = firebase.app();
        const auth = app.auth();
        Preconditions_1.Preconditions.assertPresent(auth, "Not authenticated (no auth)");
        const user = this.user || auth.currentUser;
        Preconditions_1.Preconditions.assertPresent(user, "Not authenticated (no user)");
        return user.uid;
    }
    static computeDocMetaID(fingerprint, uid = FirebaseDatastores.getUserID()) {
        return Hashcodes_1.Hashcodes.createID(uid + ':' + fingerprint, 32);
    }
}
exports.FirebaseDatastores = FirebaseDatastores;
FirebaseDatastores.initialized = false;
//# sourceMappingURL=FirebaseDatastores.js.map