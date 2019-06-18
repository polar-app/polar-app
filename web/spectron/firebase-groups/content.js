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
                    function doGroupProvision() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                            const request = {
                                docs: [],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBQ3JFLDhGQUF5RjtBQUN6RixrRUFBNkQ7QUFFN0QsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUl0QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksQ0FBRSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFD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LENBQUMsQ0FBQztvQkFFMUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdEQsQ0FBQzthQUFBLENBQUMsQ0FBQztRQUVQLENBQUM7S0FBQSxDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBa0IsRUFBRSxFQUFFO1FBRTdCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQzthQUN6QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFdkUsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTcGVjdHJvblJlbmRlcmVyfSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uUmVuZGVyZXInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtGaXJlYmFzZX0gZnJvbSAnLi4vLi4vanMvZmlyZWJhc2UvRmlyZWJhc2UnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvblJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZVJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZXN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7R3JvdXBKb2luc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBKb2lucyc7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0dyb3VwSURTdHJ9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3Vwcyc7XG5pbXBvcnQge0dyb3Vwc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBzJztcbmltcG9ydCB7R3JvdXBNZW1iZXJzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cE1lbWJlcnMnO1xuaW1wb3J0IHtHcm91cE1lbWJlckludml0YXRpb25zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cE1lbWJlckludml0YXRpb25zJztcbmltcG9ydCB7UHJvZmlsZXN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVzJztcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEyMDAwMCk7XG5cbi8vIHByb2Nlc3MuZW52LlBPTEFSX1RFU1RfUFJPSkVDVCA9ICdwb2xhci10ZXN0Mic7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMiE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMiA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MyITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgLy8gVE9ETzogbmV4dCBiaWcgdGhpbmcgaXMgdG8gYXVkaXQgaG93IGZhc3Qvc2xvdyB0aGlzIGlzIG9uIG91ciBwcm9kdWN0aW9uXG4gICAgLy8gZmlyZXN0b3JlIGluc3RhbmNlLlxuXG4gICAgLy8gVE9ETzogd2hhdCBpcyBkb2NfZmlsZV9tZXRhID8/P1xuICAgIC8vIFRPRE86IGNyZWF0ZSBhIHByb2ZpbGVJRCBmb3IgdXNlcjEgYW5kIG5vIHByb2ZpbGVJRCBmb3IgdXNlcjIgYW5kIG1ha2VcbiAgICAvLyBzdXJlIHRoZSBjb250YWN0cyBhcmUgdXBkYXRlZCBhcHByb3ByaWF0ZWx5LlxuXG4gICAgLy8gVE9ETzogdGVzdCB3aXRoIHRhZ3MgYW5kIHRhZyBzZWFyY2ggZm9yIGdyb3VwcyBzbyB3ZSBjYW4gdHJ5IHRvIGRlbGV0ZVxuICAgIC8vIHRoZW0uLi5cblxuICAgIC8vIEZ1dHVyZSB3b3JrOlxuICAgIC8vXG4gICAgLy8gICAtIFRPRE86IHRlc3QgcHVibGljIGdyb3VwcyBhbmQgcHJvdGVjdGVkIGdyb3Vwc1xuXG4gICAgZGVzY3JpYmUoXCJmaXJlYmFzZS1ncm91cHNcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJncm91cCBwcm92aXNpb24gb2YgcHJpdmF0ZSBncm91cFwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkb0dyb3VwUHJvdmlzaW9uKCkge1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IEdyb3VwUHJvdmlzaW9uUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jczogW10sXG4gICAgICAgICAgICAgICAgICAgIGludml0YXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlByaXZhdGUgaW52aXRlIHRvIG15IHNwZWNpYWwgZ3JvdXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2dldHBvbGFyaXplZC50ZXN0K3Rlc3QxQGdtYWlsLmNvbSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ3ByaXZhdGUnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgR3JvdXBQcm92aXNpb25zLmV4ZWMocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmlkO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwSUQgPSBhd2FpdCBkb0dyb3VwUHJvdmlzaW9uKCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGRvR3JvdXBKb2luKGdyb3VwSUQ6IEdyb3VwSURTdHIpIHtcblxuICAgICAgICAgICAgICAgIC8vIG5vdyBzd2l0Y2ggdG8gdGhlIHVzZXIgdGhhdCB3YXMgaW52aXRlZCBhbmQgam9pbiB0aGF0IGdyb3VwLlxuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSMSwgRklSRUJBU0VfUEFTUzEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucyA9IGF3YWl0IEdyb3VwTWVtYmVySW52aXRhdGlvbnMubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gaXQncyBpbXBvcnRhbnQgdGhhdCB0aGUgdXNlciBjYW4gc2VlIHRoZWlyIG93biBpbnZpdGF0aW9ucy5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5maWx0ZXIoY3VycmVudCA9PiBjdXJyZW50Lmdyb3VwSUQgPT09IGdyb3VwSUQpLmxlbmd0aCwgMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlVXBkYXRlUmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm9iIEpvaG5zb25cIixcbiAgICAgICAgICAgICAgICAgICAgYmlvOiBcIkFuIGV4YW1wbGUgdXNlciBmcm9tIE1hcnNcIixcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IFwiQ2FwaXRvbCBDaXR5LCBNYXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3Lm1hcnMub3JnJ11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvZmlsZVVwZGF0ZXMuZXhlYyhwcm9maWxlVXBkYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBHcm91cEpvaW5zLmV4ZWMoe2dyb3VwSUR9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBkb0dyb3VwSm9pbihncm91cElEKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVHcm91cFNldHRpbmdzQWZ0ZXJKb2luKGdyb3VwSUQ6IEdyb3VwSURTdHIpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBhcHAuYXV0aCgpLmN1cnJlbnRVc2VyITtcbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwodXNlci5lbWFpbCwgRklSRUJBU0VfVVNFUjEpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0aW5nIHBlcm1pc3Npb25zIGZvciB1c2VyOiBcIiArIHVzZXIudWlkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlc3RpbmcgcGVybWlzc2lvbnMgZm9yIGdyb3VwOiBcIiArIGdyb3VwSUQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBhd2FpdCBHcm91cHMuZ2V0KGdyb3VwSUQpO1xuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzRGVmaW5lZChncm91cCk7XG5cbiAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgbnJNZW1iZXJzIGNvdW50cyBvbiB0aGUgZ3JvdXBzIGFyZSBzZXR1cCBwcm9wZXJseS5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXAhLm5yTWVtYmVycywgMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cE1lbWJlcnMgPSBhd2FpdCBHcm91cE1lbWJlcnMubGlzdChncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChncm91cE1lbWJlcnMubGVuZ3RoLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIG5vdyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIGludml0YXRpb25zIGZvciB0aGlzIGdyb3VwIGFmdGVyIC4uLlxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwTWVtYmVySW52aXRhdGlvbnMgPSBhd2FpdCBHcm91cE1lbWJlckludml0YXRpb25zLmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChncm91cE1lbWJlckludml0YXRpb25zLmZpbHRlcihjdXJyZW50ID0+IGN1cnJlbnQuZ3JvdXBJRCA9PT0gZ3JvdXBJRCkubGVuZ3RoLCAwKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZUdyb3VwU2V0dGluZ3NBZnRlckpvaW4oZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlUGVybWlzc2lvbkRlbmllZEZvck90aGVycyhncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIyLCBGSVJFQkFTRV9QQVNTMik7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCB2ZXJpZnlGYWlsZWQoYXN5bmMgKCkgPT4gYXdhaXQgR3JvdXBzLmdldChncm91cElEKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHZhbGlkYXRlUGVybWlzc2lvbkRlbmllZEZvck90aGVycyhncm91cElEKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJQcm9maWxlIHVwZGF0ZVwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBQcm9maWxlVXBkYXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkFsaWNlIFNtaXRoXCIsXG4gICAgICAgICAgICAgICAgYmlvOiBcIkFuIGV4YW1wbGUgdXNlciBmcm9tIHRoZSBsYW5kIG9mIE96XCIsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IFwiQ2FwaXRvbCBDaXR5LCBPelwiLFxuICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3LndvbmRlcmxhbmQub3JnJ11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocmVxdWVzdCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBQcm9maWxlcy5jdXJyZW50VXNlclByb2ZpbGUoKTtcblxuICAgICAgICAgICAgYXNzZXJ0LmlzRGVmaW5lZChwcm9maWxlKTtcblxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHByb2ZpbGUhLm5hbWUsIHJlcXVlc3QubmFtZSk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocHJvZmlsZSEuYmlvLCByZXF1ZXN0LmJpbyk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocHJvZmlsZSEubG9jYXRpb24sIHJlcXVlc3QubG9jYXRpb24pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBtb2NoYS5ydW4oKG5yRmFpbHVyZXM6IG51bWJlcikgPT4ge1xuXG4gICAgICAgIHN0YXRlLnRlc3RSZXN1bHRXcml0ZXIud3JpdGUobnJGYWlsdXJlcyA9PT0gMClcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byB3cml0ZSByZXN1bHRzOiBcIiwgZXJyKSk7XG5cbiAgICB9KTtcblxufSk7XG4iXX0=