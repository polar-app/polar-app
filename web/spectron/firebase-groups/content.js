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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBQ3JFLDhGQUF5RjtBQUN6RixrRUFBNkQ7QUFFN0QsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV0QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksQ0FBRSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFD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Q0FBQyxDQUFDO29CQUUxQixhQUFNLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQyxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV0RCxDQUFDO2FBQUEsQ0FBQyxDQUFDO1FBRVAsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFFN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO2FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RSxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vanMvbG9nZ2VyL0xvZ2dlcic7XG5pbXBvcnQge0ZpcmViYXNlfSBmcm9tICcuLi8uLi9qcy9maXJlYmFzZS9GaXJlYmFzZSc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtHcm91cEpvaW5zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cEpvaW5zJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7R3JvdXBJRFN0cn0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBzJztcbmltcG9ydCB7R3JvdXBzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cHMnO1xuaW1wb3J0IHtHcm91cE1lbWJlcnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwTWVtYmVycyc7XG5pbXBvcnQge0dyb3VwTWVtYmVySW52aXRhdGlvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwTWVtYmVySW52aXRhdGlvbnMnO1xuaW1wb3J0IHtQcm9maWxlc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZXMnO1xuXG5jb25zdCBsb2cgPSBMb2dnZXIuY3JlYXRlKCk7XG5cbm1vY2hhLnNldHVwKCdiZGQnKTtcbm1vY2hhLnRpbWVvdXQoMTIwMDAwKTtcblxuY29uc3QgRklSRUJBU0VfVVNFUiA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1VTRVIhO1xuY29uc3QgRklSRUJBU0VfUEFTUyA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MhO1xuXG5jb25zdCBGSVJFQkFTRV9VU0VSMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1VTRVIxITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MxID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfUEFTUzEhO1xuXG5jb25zdCBGSVJFQkFTRV9VU0VSMiA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1VTRVIyITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MyID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfUEFTUzIhO1xuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlGYWlsZWQoZGVsZWdhdGU6ICgpID0+IFByb21pc2U8YW55Pikge1xuXG4gICAgbGV0IGZhaWxlZDogYm9vbGVhbjtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgYXdhaXQgZGVsZWdhdGUoKTtcbiAgICAgICAgZmFpbGVkID0gZmFsc2U7XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCEgZmFpbGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpZCBub3QgZmFpbCBhcyBleHBlY3RlZFwiKTtcbiAgICB9XG5cbn1cblxuU3BlY3Ryb25SZW5kZXJlci5ydW4oYXN5bmMgKHN0YXRlKSA9PiB7XG5cbiAgICAvLyBUT0RPOiBuZXh0IGJpZyB0aGluZyBpcyB0byBhdWRpdCBob3cgZmFzdC9zbG93IHRoaXMgaXMgb24gb3VyIHByb2R1Y3Rpb25cbiAgICAvLyBmaXJlc3RvcmUgaW5zdGFuY2UuXG5cbiAgICAvLyBUT0RPOiB3aGF0IGlzIGRvY19maWxlX21ldGEgPz8/XG4gICAgLy8gVE9ETzogY3JlYXRlIGEgcHJvZmlsZUlEIGZvciB1c2VyMSBhbmQgbm8gcHJvZmlsZUlEIGZvciB1c2VyMiBhbmQgbWFrZVxuICAgIC8vIHN1cmUgdGhlIGNvbnRhY3RzIGFyZSB1cGRhdGVkIGFwcHJvcHJpYXRlbHkuXG5cbiAgICAvLyBGdXR1cmUgd29yazpcbiAgICAvL1xuICAgIC8vICAgLSBUT0RPOiB0ZXN0IHB1YmxpYyBncm91cHMgYW5kIHByb3RlY3RlZCBncm91cHNcblxuICAgIGRlc2NyaWJlKFwiZmlyZWJhc2UtZ3JvdXBzXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KFwiZ3JvdXAgcHJvdmlzaW9uIG9mIHByaXZhdGUgZ3JvdXBcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZG9Hcm91cFByb3Zpc2lvbigpIHtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUiwgRklSRUJBU0VfUEFTUyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBHcm91cFByb3Zpc2lvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcml2YXRlIGludml0ZSB0byBteSBzcGVjaWFsIGdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnZXRwb2xhcml6ZWQudGVzdCt0ZXN0MUBnbWFpbC5jb20nXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdwcml2YXRlJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IEdyb3VwUHJvdmlzaW9ucy5leGVjKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5pZDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBncm91cElEID0gYXdhaXQgZG9Hcm91cFByb3Zpc2lvbigpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkb0dyb3VwSm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgc3dpdGNoIHRvIHRoZSB1c2VyIHRoYXQgd2FzIGludml0ZWQgYW5kIGpvaW4gdGhhdCBncm91cC5cblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUjEsIEZJUkVCQVNFX1BBU1MxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwTWVtYmVySW52aXRhdGlvbnMgPSBhd2FpdCBHcm91cE1lbWJlckludml0YXRpb25zLmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vIGl0J3MgaW1wb3J0YW50IHRoYXQgdGhlIHVzZXIgY2FuIHNlZSB0aGVpciBvd24gaW52aXRhdGlvbnMuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwTWVtYmVySW52aXRhdGlvbnMuZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudC5ncm91cElEID09PSBncm91cElEKS5sZW5ndGgsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVVwZGF0ZVJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYiBKb2huc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSBNYXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgTWFyc1wiLFxuICAgICAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy5tYXJzLm9yZyddXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocHJvZmlsZVVwZGF0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgR3JvdXBKb2lucy5leGVjKHtncm91cElEfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgZG9Hcm91cEpvaW4oZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlR3JvdXBTZXR0aW5nc0FmdGVySm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXBwLmF1dGgoKS5jdXJyZW50VXNlciE7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHVzZXIuZW1haWwsIEZJUkVCQVNFX1VTRVIxKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgdXNlcjogXCIgKyB1c2VyLnVpZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0aW5nIHBlcm1pc3Npb25zIGZvciBncm91cDogXCIgKyBncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gYXdhaXQgR3JvdXBzLmdldChncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQoZ3JvdXApO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIG5yTWVtYmVycyBjb3VudHMgb24gdGhlIGdyb3VwcyBhcmUgc2V0dXAgcHJvcGVybHkuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwIS5uck1lbWJlcnMsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gYXdhaXQgR3JvdXBNZW1iZXJzLmxpc3QoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJzLmxlbmd0aCwgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgbWFrZSBzdXJlIHRoZXJlIGFyZSBubyBpbnZpdGF0aW9ucyBmb3IgdGhpcyBncm91cCBhZnRlciAuLi5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cE1lbWJlckludml0YXRpb25zID0gYXdhaXQgR3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5saXN0KCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5maWx0ZXIoY3VycmVudCA9PiBjdXJyZW50Lmdyb3VwSUQgPT09IGdyb3VwSUQpLmxlbmd0aCwgMCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVHcm91cFNldHRpbmdzQWZ0ZXJKb2luKGdyb3VwSUQpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVBlcm1pc3Npb25EZW5pZWRGb3JPdGhlcnMoZ3JvdXBJRDogR3JvdXBJRFN0cikge1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSMiwgRklSRUJBU0VfUEFTUzIpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgdmVyaWZ5RmFpbGVkKGFzeW5jICgpID0+IGF3YWl0IEdyb3Vwcy5nZXQoZ3JvdXBJRCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZVBlcm1pc3Npb25EZW5pZWRGb3JPdGhlcnMoZ3JvdXBJRCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiUHJvZmlsZSB1cGRhdGVcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJBbGljZSBTbWl0aFwiLFxuICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSB0aGUgbGFuZCBvZiBPelwiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgT3pcIixcbiAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy53b25kZXJsYW5kLm9yZyddXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHJlcXVlc3QpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgUHJvZmlsZXMuY3VycmVudFVzZXJQcm9maWxlKCk7XG5cbiAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQocHJvZmlsZSk7XG5cbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChwcm9maWxlIS5uYW1lLCByZXF1ZXN0Lm5hbWUpO1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHByb2ZpbGUhLmJpbywgcmVxdWVzdC5iaW8pO1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHByb2ZpbGUhLmxvY2F0aW9uLCByZXF1ZXN0LmxvY2F0aW9uKTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgbW9jaGEucnVuKChuckZhaWx1cmVzOiBudW1iZXIpID0+IHtcblxuICAgICAgICBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKG5yRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gd3JpdGUgcmVzdWx0czogXCIsIGVycikpO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19