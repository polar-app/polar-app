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
exports.Invitations = void 0;
const Firestore_1 = require("../firebase/Firestore");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const firebase = __importStar(require("firebase/app"));
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Visibility_1 = require("polar-shared/src/datastore/Visibility");
const Analytics_1 = require("../analytics/Analytics");
class Invitations {
    static sendInvites(...emailAddresses) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const firestore = yield Firestore_1.Firestore.getInstance();
                for (const emailAddress of emailAddresses) {
                    const record = this.createRecord(emailAddress);
                    yield firestore
                        .collection('invitation')
                        .doc(record.id)
                        .set(record);
                }
                Analytics_1.Analytics.event({ category: 'invitations', action: 'invited' });
            }
            finally {
            }
        });
    }
    static createRecord(to) {
        const auth = firebase.app().auth();
        Preconditions_1.Preconditions.assertPresent(auth, "Not authenticated");
        const user = auth.currentUser;
        Preconditions_1.Preconditions.assertPresent(user, "Not authenticated");
        const uid = user.uid;
        const id = Hashcodes_1.Hashcodes.createRandomID();
        let image;
        if (user.photoURL) {
            image = {
                href: user.photoURL
            };
        }
        const profile = {
            email: user.email,
            name: Optional_1.Optional.of(user.displayName).getOrUndefined(),
            image
        };
        const invitation = {
            timestamp: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            from: profile,
            to
        };
        const recordHolder = {
            uid,
            id,
            visibility: Visibility_1.Visibility.PRIVATE,
            value: invitation
        };
        return recordHolder;
    }
}
exports.Invitations = Invitations;
//# sourceMappingURL=Invitations.js.map