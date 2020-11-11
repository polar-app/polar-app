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
exports.Firebase = void 0;
const firebase = __importStar(require("firebase/app"));
require("firebase/auth");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
const PROJECTS = {
    "polar-test2": {
        apiKey: "AIzaSyByrYfWcYQAFaBRroM-M96lWCyX0cp3SKg",
        authDomain: "polar-test2.firebaseapp.com",
        databaseURL: "https://polar-test2.firebaseio.com",
        projectId: "polar-test2",
        storageBucket: "polar-test2.appspot.com",
        messagingSenderId: "1051837764975",
        appId: "1:1051837764975:web:8f9f8fd4a3a9b76b"
    },
    "prod": {
        apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
        authDomain: "polar-32b0f.firebaseapp.com",
        databaseURL: "https://polar-32b0f.firebaseio.com",
        projectId: "polar-32b0f",
        storageBucket: "polar-32b0f.appspot.com",
        messagingSenderId: "919499255851",
    }
};
class Firebase {
    static init() {
        if (this.app) {
            return this.app;
        }
        try {
            log.notice("Initializing firebase...");
            this.app = this.doInit();
            return this.app;
        }
        finally {
            log.notice("Initializing firebase...done");
        }
    }
    static doInit() {
        const project = process.env.POLAR_TEST_PROJECT || 'prod';
        log.info("Connecting to firebase with project: " + project);
        Preconditions_1.Preconditions.assertPresent(project, "project");
        const config = PROJECTS[project];
        Preconditions_1.Preconditions.assertPresent(config, "config");
        return firebase.initializeApp(config);
    }
    static currentUser() {
        Firebase.init();
        const auth = firebase.auth();
        return auth.currentUser || undefined;
    }
    static currentUserAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            Firebase.init();
            return new Promise((resolve, reject) => {
                const unsubscribe = firebase.auth()
                    .onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                }, (err) => {
                    unsubscribe();
                    reject(err);
                });
            });
        });
    }
    static currentUserID() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.currentUser()) === null || _a === void 0 ? void 0 : _a.uid;
        });
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=Firebase.js.map