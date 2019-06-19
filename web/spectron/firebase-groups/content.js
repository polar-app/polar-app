"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const Logger_1 = require("../../js/logger/Logger");
const Firebase_1 = require("../../js/firebase/Firebase");
const GroupProvisions_1 = require("../../js/datastore/sharing/GroupProvisions");
const ProfileUpdates_1 = require("../../js/datastore/sharing/ProfileUpdates");
const GroupJoins_1 = require("../../js/datastore/sharing/GroupJoins");
const chai_1 = require("chai");
const Groups_1 = require("../../js/datastore/sharing/Groups");
const GroupMembers_1 = require("../../js/datastore/sharing/GroupMembers");
const GroupMemberInvitations_1 = require("../../js/datastore/sharing/GroupMemberInvitations");
const Profiles_1 = require("../../js/datastore/sharing/Profiles");
const FirebaseDatastore_1 = require("../../js/datastore/FirebaseDatastore");
const DocMetas_1 = require("../../js/metadata/DocMetas");
const DocRefs_1 = require("../../js/datastore/sharing/DocRefs");
const log = Logger_1.Logger.create();
mocha.setup('bdd');
mocha.timeout(120000);
const FIREBASE_USER = process.env.FIREBASE_USER;
const FIREBASE_PASS = process.env.FIREBASE_PASS;
const FIREBASE_USER1 = process.env.FIREBASE_USER1;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1;
const FIREBASE_USER2 = process.env.FIREBASE_USER2;
const FIREBASE_PASS2 = process.env.FIREBASE_PASS2;
function verifyFailed(delegate) {
    return __awaiter(this, void 0, void 0, function* () {
        let failed;
        try {
            yield delegate();
            failed = false;
        }
        catch (e) {
            failed = true;
        }
        if (!failed) {
            throw new Error("Did not fail as expected");
        }
    });
}
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(this, void 0, void 0, function* () {
    describe("firebase-groups", function () {
        return __awaiter(this, void 0, void 0, function* () {
            it("group provision of private group", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    function provisionAccountData() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                            const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                            yield firebaseDatastore.init();
                            return yield DocMetas_1.MockDocMetas.createMockDocMetaFromPDF(firebaseDatastore);
                        });
                    }
                    const mockDock = yield provisionAccountData();
                    function doGroupProvision() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const { docMeta } = mockDock;
                            const docID = FirebaseDatastore_1.FirebaseDatastore.computeDocMetaID(docMeta.docInfo.fingerprint);
                            const docRef = DocRefs_1.DocRefs.fromDocMeta(docID, docMeta);
                            const request = {
                                docs: [
                                    docRef
                                ],
                                invitations: {
                                    message: "Private invite to my special group",
                                    to: [
                                        'getpolarized.test+test1@gmail.com'
                                    ]
                                },
                                visibility: 'private'
                            };
                            const response = yield GroupProvisions_1.GroupProvisions.exec(request);
                            return response.id;
                        });
                    }
                    const groupID = yield doGroupProvision();
                    function doGroupJoin(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                            const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                            chai_1.assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1);
                            const profileUpdateRequest = {
                                name: "Bob Johnson",
                                bio: "An example user from Mars",
                                location: "Capitol City, Mars",
                                links: ['https://www.mars.org']
                            };
                            yield ProfileUpdates_1.ProfileUpdates.exec(profileUpdateRequest);
                            yield GroupJoins_1.GroupJoins.exec({ groupID });
                        });
                    }
                    yield doGroupJoin(groupID);
                    function validateGroupSettingsAfterJoin(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const user = app.auth().currentUser;
                            chai_1.assert.equal(user.email, FIREBASE_USER1);
                            console.log("Testing permissions for user: " + user.uid);
                            console.log("Testing permissions for group: " + groupID);
                            const group = yield Groups_1.Groups.get(groupID);
                            chai_1.assert.isDefined(group);
                            chai_1.assert.equal(group.nrMembers, 1);
                            const groupMembers = yield GroupMembers_1.GroupMembers.list(groupID);
                            chai_1.assert.equal(groupMembers.length, 1);
                            const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                            chai_1.assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 0);
                        });
                    }
                    yield validateGroupSettingsAfterJoin(groupID);
                    function validatePermissionDeniedForOthers(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER2, FIREBASE_PASS2);
                            yield verifyFailed(() => __awaiter(this, void 0, void 0, function* () { return yield Groups_1.Groups.get(groupID); }));
                        });
                    }
                    yield validatePermissionDeniedForOthers(groupID);
                });
            });
            it("Profile update", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                    const request = {
                        name: "Alice Smith",
                        bio: "An example user from the land of Oz",
                        location: "Capitol City, Oz",
                        links: ['https://www.wonderland.org']
                    };
                    yield ProfileUpdates_1.ProfileUpdates.exec(request);
                    const profile = yield Profiles_1.Profiles.currentUserProfile();
                    chai_1.assert.isDefined(profile);
                    chai_1.assert.equal(profile.name, request.name);
                    chai_1.assert.equal(profile.bio, request.bio);
                    chai_1.assert.equal(profile.location, request.location);
                });
            });
        });
    });
    mocha.run((nrFailures) => {
        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBQ3JFLDhGQUF5RjtBQUN6RixrRUFBNkQ7QUFFN0QsNEVBQXVFO0FBQ3ZFLHlEQUF3RDtBQUN4RCxnRUFBMkQ7QUFFM0QsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUl0QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUks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QUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFdkUsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTcGVjdHJvblJlbmRlcmVyfSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uUmVuZGVyZXInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtGaXJlYmFzZX0gZnJvbSAnLi4vLi4vanMvZmlyZWJhc2UvRmlyZWJhc2UnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvblJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZVJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZXN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7R3JvdXBKb2luc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBKb2lucyc7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0dyb3VwSURTdHJ9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3Vwcyc7XG5pbXBvcnQge0dyb3Vwc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBzJztcbmltcG9ydCB7R3JvdXBNZW1iZXJzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cE1lbWJlcnMnO1xuaW1wb3J0IHtHcm91cE1lbWJlckludml0YXRpb25zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cE1lbWJlckludml0YXRpb25zJztcbmltcG9ydCB7UHJvZmlsZXN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVzJztcbmltcG9ydCB7RmlyZWJhc2VEYXRhc3RvcmVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRmlyZWJhc2VEYXRhc3RvcmVzJztcbmltcG9ydCB7RmlyZWJhc2VEYXRhc3RvcmV9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9GaXJlYmFzZURhdGFzdG9yZSc7XG5pbXBvcnQge01vY2tEb2NNZXRhc30gZnJvbSAnLi4vLi4vanMvbWV0YWRhdGEvRG9jTWV0YXMnO1xuaW1wb3J0IHtEb2NSZWZzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Eb2NSZWZzJztcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEyMDAwMCk7XG5cbi8vIHByb2Nlc3MuZW52LlBPTEFSX1RFU1RfUFJPSkVDVCA9ICdwb2xhci10ZXN0Mic7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMiE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMiA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MyITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgLy8gVE9ETzogVGVzdCB1c2luZyBhY3R1YWwgZG9jcyBub3QgZW1wdHkgZG9jcy4uLlxuXG4gICAgLy8gVE9ETzogbmV4dCBiaWcgdGhpbmcgaXMgdG8gYXVkaXQgaG93IGZhc3Qvc2xvdyB0aGlzIGlzIG9uIG91ciBwcm9kdWN0aW9uXG4gICAgLy8gZmlyZXN0b3JlIGluc3RhbmNlLlxuXG4gICAgLy8gVE9ETzogY3JlYXRlIGEgcHJvZmlsZUlEIGZvciB1c2VyMSBhbmQgbm8gcHJvZmlsZUlEIGZvciB1c2VyMiBhbmQgbWFrZVxuICAgIC8vIHN1cmUgdGhlIGNvbnRhY3RzIGFyZSB1cGRhdGVkIGFwcHJvcHJpYXRlbHkuXG5cbiAgICAvLyBUT0RPOiB0ZXN0IHdpdGggdGFncyBhbmQgdGFnIHNlYXJjaCBmb3IgZ3JvdXBzIHNvIHdlIGNhbiB0cnkgdG8gZGVsZXRlXG4gICAgLy8gdGhlbS4uLlxuXG4gICAgLy8gRnV0dXJlIHdvcms6XG4gICAgLy9cbiAgICAvLyAgIC0gVE9ETzogdGVzdCBwdWJsaWMgZ3JvdXBzIGFuZCBwcm90ZWN0ZWQgZ3JvdXBzXG5cbiAgICBkZXNjcmliZShcImZpcmViYXNlLWdyb3Vwc1wiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdChcImdyb3VwIHByb3Zpc2lvbiBvZiBwcml2YXRlIGdyb3VwXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBGaXJlYmFzZS5pbml0KCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHByb3Zpc2lvbkFjY291bnREYXRhKCkge1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcmViYXNlRGF0YXN0b3JlID0gbmV3IEZpcmViYXNlRGF0YXN0b3JlKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlyZWJhc2VEYXRhc3RvcmUuaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IE1vY2tEb2NNZXRhcy5jcmVhdGVNb2NrRG9jTWV0YUZyb21QREYoZmlyZWJhc2VEYXRhc3RvcmUpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1vY2tEb2NrID0gYXdhaXQgcHJvdmlzaW9uQWNjb3VudERhdGEoKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZG9Hcm91cFByb3Zpc2lvbigpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHtkb2NNZXRhfSA9IG1vY2tEb2NrO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRvY0lEID0gRmlyZWJhc2VEYXRhc3RvcmUuY29tcHV0ZURvY01ldGFJRChkb2NNZXRhLmRvY0luZm8uZmluZ2VycHJpbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZG9jUmVmID0gRG9jUmVmcy5mcm9tRG9jTWV0YShkb2NJRCwgZG9jTWV0YSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBHcm91cFByb3Zpc2lvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3M6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY1JlZlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcml2YXRlIGludml0ZSB0byBteSBzcGVjaWFsIGdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnZXRwb2xhcml6ZWQudGVzdCt0ZXN0MUBnbWFpbC5jb20nXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdwcml2YXRlJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IEdyb3VwUHJvdmlzaW9ucy5leGVjKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5pZDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBncm91cElEID0gYXdhaXQgZG9Hcm91cFByb3Zpc2lvbigpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkb0dyb3VwSm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgc3dpdGNoIHRvIHRoZSB1c2VyIHRoYXQgd2FzIGludml0ZWQgYW5kIGpvaW4gdGhhdCBncm91cC5cblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUjEsIEZJUkVCQVNFX1BBU1MxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwTWVtYmVySW52aXRhdGlvbnMgPSBhd2FpdCBHcm91cE1lbWJlckludml0YXRpb25zLmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vIGl0J3MgaW1wb3J0YW50IHRoYXQgdGhlIHVzZXIgY2FuIHNlZSB0aGVpciBvd24gaW52aXRhdGlvbnMuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwTWVtYmVySW52aXRhdGlvbnMuZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudC5ncm91cElEID09PSBncm91cElEKS5sZW5ndGgsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVVwZGF0ZVJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYiBKb2huc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSBNYXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgTWFyc1wiLFxuICAgICAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy5tYXJzLm9yZyddXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocHJvZmlsZVVwZGF0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgR3JvdXBKb2lucy5leGVjKHtncm91cElEfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgZG9Hcm91cEpvaW4oZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlR3JvdXBTZXR0aW5nc0FmdGVySm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXBwLmF1dGgoKS5jdXJyZW50VXNlciE7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHVzZXIuZW1haWwsIEZJUkVCQVNFX1VTRVIxKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgdXNlcjogXCIgKyB1c2VyLnVpZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0aW5nIHBlcm1pc3Npb25zIGZvciBncm91cDogXCIgKyBncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gYXdhaXQgR3JvdXBzLmdldChncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQoZ3JvdXApO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIG5yTWVtYmVycyBjb3VudHMgb24gdGhlIGdyb3VwcyBhcmUgc2V0dXAgcHJvcGVybHkuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwIS5uck1lbWJlcnMsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gYXdhaXQgR3JvdXBNZW1iZXJzLmxpc3QoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJzLmxlbmd0aCwgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgbWFrZSBzdXJlIHRoZXJlIGFyZSBubyBpbnZpdGF0aW9ucyBmb3IgdGhpcyBncm91cCBhZnRlciAuLi5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cE1lbWJlckludml0YXRpb25zID0gYXdhaXQgR3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5saXN0KCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5maWx0ZXIoY3VycmVudCA9PiBjdXJyZW50Lmdyb3VwSUQgPT09IGdyb3VwSUQpLmxlbmd0aCwgMCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVHcm91cFNldHRpbmdzQWZ0ZXJKb2luKGdyb3VwSUQpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVBlcm1pc3Npb25EZW5pZWRGb3JPdGhlcnMoZ3JvdXBJRDogR3JvdXBJRFN0cikge1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSMiwgRklSRUJBU0VfUEFTUzIpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgdmVyaWZ5RmFpbGVkKGFzeW5jICgpID0+IGF3YWl0IEdyb3Vwcy5nZXQoZ3JvdXBJRCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZVBlcm1pc3Npb25EZW5pZWRGb3JPdGhlcnMoZ3JvdXBJRCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiUHJvZmlsZSB1cGRhdGVcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJBbGljZSBTbWl0aFwiLFxuICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSB0aGUgbGFuZCBvZiBPelwiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgT3pcIixcbiAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy53b25kZXJsYW5kLm9yZyddXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHJlcXVlc3QpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgUHJvZmlsZXMuY3VycmVudFVzZXJQcm9maWxlKCk7XG5cbiAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQocHJvZmlsZSk7XG5cbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChwcm9maWxlIS5uYW1lLCByZXF1ZXN0Lm5hbWUpO1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHByb2ZpbGUhLmJpbywgcmVxdWVzdC5iaW8pO1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHByb2ZpbGUhLmxvY2F0aW9uLCByZXF1ZXN0LmxvY2F0aW9uKTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgbW9jaGEucnVuKChuckZhaWx1cmVzOiBudW1iZXIpID0+IHtcblxuICAgICAgICBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKG5yRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gd3JpdGUgcmVzdWx0czogXCIsIGVycikpO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19