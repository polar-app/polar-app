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
            it("group provision", function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBQ3JFLDhGQUF5RjtBQUN6RixrRUFBNkQ7QUFFN0QsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV0QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksQ0FBRSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFD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QUFDO0tBQUEsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQWtCLEVBQUUsRUFBRTtRQUU3QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUM7YUFDekMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXZFLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFBLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25SZW5kZXJlcn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvblJlbmRlcmVyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi9qcy9sb2dnZXIvTG9nZ2VyJztcbmltcG9ydCB7RmlyZWJhc2V9IGZyb20gJy4uLy4uL2pzL2ZpcmViYXNlL0ZpcmViYXNlJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25SZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVSZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge0dyb3VwSm9pbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwSm9pbnMnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtHcm91cElEU3RyfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cHMnO1xuaW1wb3J0IHtHcm91cHN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3Vwcyc7XG5pbXBvcnQge0dyb3VwTWVtYmVyc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBNZW1iZXJzJztcbmltcG9ydCB7R3JvdXBNZW1iZXJJbnZpdGF0aW9uc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBNZW1iZXJJbnZpdGF0aW9ucyc7XG5pbXBvcnQge1Byb2ZpbGVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlcyc7XG5cbmNvbnN0IGxvZyA9IExvZ2dlci5jcmVhdGUoKTtcblxubW9jaGEuc2V0dXAoJ2JkZCcpO1xubW9jaGEudGltZW91dCgxMjAwMDApO1xuXG5jb25zdCBGSVJFQkFTRV9VU0VSID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfVVNFUiE7XG5jb25zdCBGSVJFQkFTRV9QQVNTID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfUEFTUyE7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIxID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfVVNFUjEhO1xuY29uc3QgRklSRUJBU0VfUEFTUzEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTMSE7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIyID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfVVNFUjIhO1xuY29uc3QgRklSRUJBU0VfUEFTUzIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTMiE7XG5cbmFzeW5jIGZ1bmN0aW9uIHZlcmlmeUZhaWxlZChkZWxlZ2F0ZTogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG5cbiAgICBsZXQgZmFpbGVkOiBib29sZWFuO1xuXG4gICAgdHJ5IHtcblxuICAgICAgICBhd2FpdCBkZWxlZ2F0ZSgpO1xuICAgICAgICBmYWlsZWQgPSBmYWxzZTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoISBmYWlsZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkIG5vdCBmYWlsIGFzIGV4cGVjdGVkXCIpO1xuICAgIH1cblxufVxuXG5TcGVjdHJvblJlbmRlcmVyLnJ1bihhc3luYyAoc3RhdGUpID0+IHtcblxuICAgIC8vIFRPRE86IHdoYXQgaXMgZG9jX2ZpbGVfbWV0YSA/Pz9cblxuICAgIC8vIFRPRE86IGNyZWF0ZSBUV08gZ3JvdXBzIGFuZCBtYWtlIHN1cmUgdGhhdCB0aGUgdXNlciBoYXMgYWRtaW4gb24gdGhvc2VcbiAgICAvLyBncm91cHMgYW5kIHRoYXQgdGhlIHJlY29yZHMgYXJlIHNldHVwIHByb3Blcmx5LlxuXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIGEgM3JkIHBhcnR5IGNhbid0IHJlYWQgdGhlIHByaXZhdGUgZ3JvdXBzXG5cbiAgICAvLyBGdXR1cmUgd29yazpcbiAgICAvL1xuICAgIC8vICAgLSBUT0RPOiB0ZXN0IHB1YmxpYyBncm91cHMgYW5kIHByb3RlY3RlZCBncm91cHNcblxuICAgIGRlc2NyaWJlKFwiZmlyZWJhc2UtZ3JvdXBzXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KFwiZ3JvdXAgcHJvdmlzaW9uXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBGaXJlYmFzZS5pbml0KCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGRvR3JvdXBQcm92aXNpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogR3JvdXBQcm92aXNpb25SZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBkb2NzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUHJpdmF0ZSBpbnZpdGUgdG8gbXkgc3BlY2lhbCBncm91cFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZ2V0cG9sYXJpemVkLnRlc3QrdGVzdDFAZ21haWwuY29tJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAncHJpdmF0ZSdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBHcm91cFByb3Zpc2lvbnMuZXhlYyhyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuaWQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ3JvdXBJRCA9IGF3YWl0IGRvR3JvdXBQcm92aXNpb24oKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZG9Hcm91cEpvaW4oZ3JvdXBJRDogR3JvdXBJRFN0cikge1xuXG4gICAgICAgICAgICAgICAgLy8gbm93IHN3aXRjaCB0byB0aGUgdXNlciB0aGF0IHdhcyBpbnZpdGVkIGFuZCBqb2luIHRoYXQgZ3JvdXAuXG5cbiAgICAgICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIxLCBGSVJFQkFTRV9QQVNTMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cE1lbWJlckludml0YXRpb25zID0gYXdhaXQgR3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5saXN0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpdCdzIGltcG9ydGFudCB0aGF0IHRoZSB1c2VyIGNhbiBzZWUgdGhlaXIgb3duIGludml0YXRpb25zLlxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChncm91cE1lbWJlckludml0YXRpb25zLmZpbHRlcihjdXJyZW50ID0+IGN1cnJlbnQuZ3JvdXBJRCA9PT0gZ3JvdXBJRCkubGVuZ3RoLCAxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVVcGRhdGVSZXF1ZXN0OiBQcm9maWxlVXBkYXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJCb2IgSm9obnNvblwiLFxuICAgICAgICAgICAgICAgICAgICBiaW86IFwiQW4gZXhhbXBsZSB1c2VyIGZyb20gTWFyc1wiLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogXCJDYXBpdG9sIENpdHksIE1hcnNcIixcbiAgICAgICAgICAgICAgICAgICAgbGlua3M6IFsnaHR0cHM6Ly93d3cubWFycy5vcmcnXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHByb2ZpbGVVcGRhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IEdyb3VwSm9pbnMuZXhlYyh7Z3JvdXBJRH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IGRvR3JvdXBKb2luKGdyb3VwSUQpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZUdyb3VwU2V0dGluZ3NBZnRlckpvaW4oZ3JvdXBJRDogR3JvdXBJRFN0cikge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IGFwcC5hdXRoKCkuY3VycmVudFVzZXIhO1xuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbCh1c2VyLmVtYWlsLCBGSVJFQkFTRV9VU0VSMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlc3RpbmcgcGVybWlzc2lvbnMgZm9yIHVzZXI6IFwiICsgdXNlci51aWQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgZ3JvdXA6IFwiICsgZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cCA9IGF3YWl0IEdyb3Vwcy5nZXQoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNEZWZpbmVkKGdyb3VwKTtcblxuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBuck1lbWJlcnMgY291bnRzIG9uIHRoZSBncm91cHMgYXJlIHNldHVwIHByb3Blcmx5LlxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChncm91cCEubnJNZW1iZXJzLCAxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IGF3YWl0IEdyb3VwTWVtYmVycy5saXN0KGdyb3VwSUQpO1xuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwTWVtYmVycy5sZW5ndGgsIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gbm93IG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gaW52aXRhdGlvbnMgZm9yIHRoaXMgZ3JvdXAgYWZ0ZXIgLi4uXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucyA9IGF3YWl0IEdyb3VwTWVtYmVySW52aXRhdGlvbnMubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwTWVtYmVySW52aXRhdGlvbnMuZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudC5ncm91cElEID09PSBncm91cElEKS5sZW5ndGgsIDApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHZhbGlkYXRlR3JvdXBTZXR0aW5nc0FmdGVySm9pbihncm91cElEKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIlByb2ZpbGUgdXBkYXRlXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBGaXJlYmFzZS5pbml0KCk7XG5cbiAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUiwgRklSRUJBU0VfUEFTUyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiQWxpY2UgU21pdGhcIixcbiAgICAgICAgICAgICAgICBiaW86IFwiQW4gZXhhbXBsZSB1c2VyIGZyb20gdGhlIGxhbmQgb2YgT3pcIixcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogXCJDYXBpdG9sIENpdHksIE96XCIsXG4gICAgICAgICAgICAgICAgbGlua3M6IFsnaHR0cHM6Ly93d3cud29uZGVybGFuZC5vcmcnXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvZmlsZVVwZGF0ZXMuZXhlYyhyZXF1ZXN0KTtcblxuICAgICAgICAgICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IFByb2ZpbGVzLmN1cnJlbnRVc2VyUHJvZmlsZSgpO1xuXG4gICAgICAgICAgICBhc3NlcnQuaXNEZWZpbmVkKHByb2ZpbGUpO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocHJvZmlsZSEubmFtZSwgcmVxdWVzdC5uYW1lKTtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChwcm9maWxlIS5iaW8sIHJlcXVlc3QuYmlvKTtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChwcm9maWxlIS5sb2NhdGlvbiwgcmVxdWVzdC5sb2NhdGlvbik7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIG1vY2hhLnJ1bigobnJGYWlsdXJlczogbnVtYmVyKSA9PiB7XG5cbiAgICAgICAgc3RhdGUudGVzdFJlc3VsdFdyaXRlci53cml0ZShuckZhaWx1cmVzID09PSAwKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHdyaXRlIHJlc3VsdHM6IFwiLCBlcnIpKTtcblxuICAgIH0pO1xuXG59KTtcbiJdfQ==