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
const log = Logger_1.Logger.create();
mocha.setup('bdd');
mocha.timeout(120000);
const FIREBASE_USER = process.env.FIREBASE_USER;
const FIREBASE_PASS = process.env.FIREBASE_PASS;
const FIREBASE_USER1 = process.env.FIREBASE_USER1;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1;
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
            it("profile update", function () {
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
                });
            });
        });
    });
    mocha.run((nrFailures) => {
        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBQ3JFLDhGQUF5RjtBQUV6RixNQUFNLEdBQUcsR0FBRyxlQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFNUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXRCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYyxDQUFDO0FBQ2pELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYyxDQUFDO0FBRWpELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxDQUFDO0FBQ25ELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxDQUFDO0FBRW5ELFNBQWUsWUFBWSxDQUFDLFFBQTRCOztRQUVwRCxJQUFJLE1BQWUsQ0FBQztRQUVwQixJQUFJO1lBRUEsTUFBTSxRQUFRLEVBQUUsQ0FBQztZQUNqQixNQUFNLEdBQUcsS0FBSyxDQUFDO1NBRWxCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxDQUFFLE1BQU0sRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUMvQztJQUVMLENBQUM7Q0FBQTtBQUVELG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO0lBZWpDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTs7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RUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFbEcsQ0FBQztxQkFBQTtvQkFFRCxNQUFNLDhCQUE4QixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVsRCxDQUFDO2FBQUEsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFOztvQkFFakIsTUFBTSxHQUFHLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFNUIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUUxRSxNQUFNLE9BQU8sR0FBeUI7d0JBQ2xDLElBQUksRUFBRSxhQUFhO3dCQUNuQixHQUFHLEVBQUUscUNBQXFDO3dCQUMxQyxRQUFRLEVBQUUsa0JBQWtCO3dCQUM1QixLQUFLLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztxQkFDeEMsQ0FBQztvQkFFRixNQUFNLCtCQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV2QyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1FBRVAsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFFN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO2FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RSxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vanMvbG9nZ2VyL0xvZ2dlcic7XG5pbXBvcnQge0ZpcmViYXNlfSBmcm9tICcuLi8uLi9qcy9maXJlYmFzZS9GaXJlYmFzZSc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtHcm91cEpvaW5zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cEpvaW5zJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7R3JvdXBJRFN0cn0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBzJztcbmltcG9ydCB7R3JvdXBzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cHMnO1xuaW1wb3J0IHtHcm91cE1lbWJlcnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwTWVtYmVycyc7XG5pbXBvcnQge0dyb3VwTWVtYmVySW52aXRhdGlvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwTWVtYmVySW52aXRhdGlvbnMnO1xuXG5jb25zdCBsb2cgPSBMb2dnZXIuY3JlYXRlKCk7XG5cbm1vY2hhLnNldHVwKCdiZGQnKTtcbm1vY2hhLnRpbWVvdXQoMTIwMDAwKTtcblxuY29uc3QgRklSRUJBU0VfVVNFUiA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1VTRVIhO1xuY29uc3QgRklSRUJBU0VfUEFTUyA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MhO1xuXG5jb25zdCBGSVJFQkFTRV9VU0VSMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1VTRVIxITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MxID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfUEFTUzEhO1xuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlGYWlsZWQoZGVsZWdhdGU6ICgpID0+IFByb21pc2U8YW55Pikge1xuXG4gICAgbGV0IGZhaWxlZDogYm9vbGVhbjtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgYXdhaXQgZGVsZWdhdGUoKTtcbiAgICAgICAgZmFpbGVkID0gZmFsc2U7XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCEgZmFpbGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpZCBub3QgZmFpbCBhcyBleHBlY3RlZFwiKTtcbiAgICB9XG5cbn1cblxuU3BlY3Ryb25SZW5kZXJlci5ydW4oYXN5bmMgKHN0YXRlKSA9PiB7XG5cbiAgICAvLyBUT0RPOiB3aGF0IGlzIGRvY19maWxlX21ldGEgPz8/XG5cbiAgICAvLyBUT0RPOiBjcmVhdGUgVFdPIGdyb3VwcyBhbmQgbWFrZSBzdXJlIHRoYXQgdGhlIHVzZXIgaGFzIGFkbWluIG9uIHRob3NlXG4gICAgLy8gZ3JvdXBzIGFuZCB0aGF0IHRoZSByZWNvcmRzIGFyZSBzZXR1cCBwcm9wZXJseS5cblxuICAgIC8vIFRPRE86IG1ha2Ugc3VyZSBwcm9maWxlIHZhbHVlcyBhcmUgdXBkYXRlZCB0byB0aGUgY29ycmVjdCB2YWx1ZXMgcHJvcGVybHkuXG5cbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgYSAzcmQgcGFydHkgY2FuJ3QgcmVhZCB0aGUgcHJpdmF0ZSBncm91cHNcblxuICAgIC8vIEZ1dHVyZSB3b3JrOlxuICAgIC8vXG4gICAgLy8gICAtIFRPRE86IHRlc3QgcHVibGljIGdyb3VwcyBhbmQgcHJvdGVjdGVkIGdyb3Vwc1xuXG4gICAgZGVzY3JpYmUoXCJmaXJlYmFzZS1ncm91cHNcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJncm91cCBwcm92aXNpb25cIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZG9Hcm91cFByb3Zpc2lvbigpIHtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUiwgRklSRUJBU0VfUEFTUyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBHcm91cFByb3Zpc2lvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcml2YXRlIGludml0ZSB0byBteSBzcGVjaWFsIGdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnZXRwb2xhcml6ZWQudGVzdCt0ZXN0MUBnbWFpbC5jb20nXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdwcml2YXRlJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IEdyb3VwUHJvdmlzaW9ucy5leGVjKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5pZDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBncm91cElEID0gYXdhaXQgZG9Hcm91cFByb3Zpc2lvbigpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkb0dyb3VwSm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgc3dpdGNoIHRvIHRoZSB1c2VyIHRoYXQgd2FzIGludml0ZWQgYW5kIGpvaW4gdGhhdCBncm91cC5cblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUjEsIEZJUkVCQVNFX1BBU1MxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwTWVtYmVySW52aXRhdGlvbnMgPSBhd2FpdCBHcm91cE1lbWJlckludml0YXRpb25zLmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vIGl0J3MgaW1wb3J0YW50IHRoYXQgdGhlIHVzZXIgY2FuIHNlZSB0aGVpciBvd24gaW52aXRhdGlvbnMuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwTWVtYmVySW52aXRhdGlvbnMuZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudC5ncm91cElEID09PSBncm91cElEKS5sZW5ndGgsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVVwZGF0ZVJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYiBKb2huc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSBNYXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgTWFyc1wiLFxuICAgICAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy5tYXJzLm9yZyddXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocHJvZmlsZVVwZGF0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgR3JvdXBKb2lucy5leGVjKHtncm91cElEfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgZG9Hcm91cEpvaW4oZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlR3JvdXBTZXR0aW5nc0FmdGVySm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXBwLmF1dGgoKS5jdXJyZW50VXNlciE7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHVzZXIuZW1haWwsIEZJUkVCQVNFX1VTRVIxKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgdXNlcjogXCIgKyB1c2VyLnVpZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0aW5nIHBlcm1pc3Npb25zIGZvciBncm91cDogXCIgKyBncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gYXdhaXQgR3JvdXBzLmdldChncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQoZ3JvdXApO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIG5yTWVtYmVycyBjb3VudHMgb24gdGhlIGdyb3VwcyBhcmUgc2V0dXAgcHJvcGVybHkuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwIS5uck1lbWJlcnMsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gYXdhaXQgR3JvdXBNZW1iZXJzLmxpc3QoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJzLmxlbmd0aCwgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgbWFrZSBzdXJlIHRoZXJlIGFyZSBubyBpbnZpdGF0aW9ucyBmb3IgdGhpcyBncm91cCBhZnRlciAuLi5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cE1lbWJlckludml0YXRpb25zID0gYXdhaXQgR3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5saXN0KCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJJbnZpdGF0aW9ucy5maWx0ZXIoY3VycmVudCA9PiBjdXJyZW50Lmdyb3VwSUQgPT09IGdyb3VwSUQpLmxlbmd0aCwgMCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVHcm91cFNldHRpbmdzQWZ0ZXJKb2luKGdyb3VwSUQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwicHJvZmlsZSB1cGRhdGVcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJBbGljZSBTbWl0aFwiLFxuICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSB0aGUgbGFuZCBvZiBPelwiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgT3pcIixcbiAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy53b25kZXJsYW5kLm9yZyddXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHJlcXVlc3QpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBtb2NoYS5ydW4oKG5yRmFpbHVyZXM6IG51bWJlcikgPT4ge1xuXG4gICAgICAgIHN0YXRlLnRlc3RSZXN1bHRXcml0ZXIud3JpdGUobnJGYWlsdXJlcyA9PT0gMClcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byB3cml0ZSByZXN1bHRzOiBcIiwgZXJyKSk7XG5cbiAgICB9KTtcblxufSk7XG4iXX0=