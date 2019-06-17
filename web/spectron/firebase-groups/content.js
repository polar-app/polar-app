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
                    function doGroupJoin() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
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
                    yield doGroupJoin();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFDekQsMEVBQXFFO0FBRXJFLE1BQU0sR0FBRyxHQUFHLGVBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU1QixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFdEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFjLENBQUM7QUFDakQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFjLENBQUM7QUFFakQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLENBQUM7QUFDbkQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLENBQUM7QUFFbkQsU0FBZSxZQUFZLENBQUMsUUFBNEI7O1FBRXBELElBQUksTUFBZSxDQUFDO1FBRXBCLElBQUk7WUFFQSxNQUFNLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FFbEI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUUsTUFBTSxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQy9DO0lBRUwsQ0FBQztDQUFBO0FBRUQsbUNBQWdCLENBQUMsR0FBRyxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7SUFxQmpDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTs7WUFFeEIsRUFBRSxD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K0JBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRXZDLENBQUM7YUFBQSxDQUFDLENBQUM7UUFFUCxDQUFDO0tBQUEsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQWtCLEVBQUUsRUFBRTtRQUU3QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUM7YUFDekMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXZFLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFBLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25SZW5kZXJlcn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvblJlbmRlcmVyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi9qcy9sb2dnZXIvTG9nZ2VyJztcbmltcG9ydCB7RmlyZWJhc2V9IGZyb20gJy4uLy4uL2pzL2ZpcmViYXNlL0ZpcmViYXNlJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25SZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVSZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge0dyb3VwSm9pbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwSm9pbnMnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtHcm91cElEU3RyfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cHMnO1xuaW1wb3J0IHtHcm91cHN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3Vwcyc7XG5pbXBvcnQge0dyb3VwTWVtYmVyc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBNZW1iZXJzJztcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEyMDAwMCk7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgLy8gVE9ETzogd2hhdCBpcyBkb2NfZmlsZV9tZXRhID8/P1xuXG4gICAgLy8gVE9ETzogY3JlYXRlIFRXTyBncm91cHMgYW5kIG1ha2Ugc3VyZSB0aGF0IHRoZSB1c2VyIGhhcyBhZG1pbiBvbiB0aG9zZVxuICAgIC8vIGdyb3VwcyBhbmQgdGhhdCB0aGUgcmVjb3JkcyBhcmUgc2V0dXAgcHJvcGVybHkuXG5cbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgcHJvZmlsZSB2YWx1ZXMgYXJlIHVwZGF0ZWQgdG8gdGhlIGNvcnJlY3QgdmFsdWVzIHByb3Blcmx5LlxuXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIGEgM3JkIHBhcnR5IGNhbid0IHJlYWQgdGhlIHByaXZhdGUgZ3JvdXBzXG5cbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgdGhlIHVzZXIgY2FuIHNlZSB0aGVpciBncm91cF9tZW1iZXJfaW52aXRhdGlvbiByZWNvcmRcblxuICAgIC8vIFRPRE86IG1ha2Ugc3VyZSB0aGUgZ3JvdXBfbWVtYmVyX2ludml0YXRpb24gIHJlY29yZHMgYXJlIHByZXNlbnQgYmVmb3JlXG4gICAgLy8gYW5kIHRoZW4gcmVtb3ZlZCBGSVhNRTogSSBjb25maXJtZWQgdGhhdCBncm91cF9tZW1iZXJfaW52aXRhdGlvbiBpcyBub3RcbiAgICAvLyBiZWluZyByZW1vdmVkXG5cbiAgICAvLyBGdXR1cmUgd29yazpcbiAgICAvL1xuICAgIC8vICAgLSBUT0RPOiB0ZXN0IHB1YmxpYyBncm91cHMgYW5kIHByb3RlY3RlZCBncm91cHNcblxuICAgIGRlc2NyaWJlKFwiZmlyZWJhc2UtZ3JvdXBzXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KFwiZ3JvdXAgcHJvdmlzaW9uXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBGaXJlYmFzZS5pbml0KCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGRvR3JvdXBQcm92aXNpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogR3JvdXBQcm92aXNpb25SZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBkb2NzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUHJpdmF0ZSBpbnZpdGUgdG8gbXkgc3BlY2lhbCBncm91cFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZ2V0cG9sYXJpemVkLnRlc3QrdGVzdDFAZ21haWwuY29tJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAncHJpdmF0ZSdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBHcm91cFByb3Zpc2lvbnMuZXhlYyhyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuaWQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ3JvdXBJRCA9IGF3YWl0IGRvR3JvdXBQcm92aXNpb24oKTtcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZG9Hcm91cEpvaW4oKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBub3cgc3dpdGNoIHRvIHRoZSB1c2VyIHRoYXQgd2FzIGludml0ZWQgYW5kIGpvaW4gdGhhdCBncm91cC5cblxuICAgICAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUjEsIEZJUkVCQVNFX1BBU1MxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVVcGRhdGVSZXF1ZXN0OiBQcm9maWxlVXBkYXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJCb2IgSm9obnNvblwiLFxuICAgICAgICAgICAgICAgICAgICBiaW86IFwiQW4gZXhhbXBsZSB1c2VyIGZyb20gTWFyc1wiLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogXCJDYXBpdG9sIENpdHksIE1hcnNcIixcbiAgICAgICAgICAgICAgICAgICAgbGlua3M6IFsnaHR0cHM6Ly93d3cubWFycy5vcmcnXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHByb2ZpbGVVcGRhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IEdyb3VwSm9pbnMuZXhlYyh7Z3JvdXBJRH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IGRvR3JvdXBKb2luKCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlR3JvdXBTZXR0aW5nc0FmdGVySm9pbihncm91cElEOiBHcm91cElEU3RyKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXBwLmF1dGgoKS5jdXJyZW50VXNlciE7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHVzZXIuZW1haWwsIEZJUkVCQVNFX1VTRVIxKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgdXNlcjogXCIgKyB1c2VyLnVpZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0aW5nIHBlcm1pc3Npb25zIGZvciBncm91cDogXCIgKyBncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gYXdhaXQgR3JvdXBzLmdldChncm91cElEKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5pc0RlZmluZWQoZ3JvdXApO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIG5yTWVtYmVycyBjb3VudHMgb24gdGhlIGdyb3VwcyBhcmUgc2V0dXAgcHJvcGVybHkuXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGdyb3VwIS5uck1lbWJlcnMsIDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gYXdhaXQgR3JvdXBNZW1iZXJzLmxpc3QoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZ3JvdXBNZW1iZXJzLmxlbmd0aCwgMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVHcm91cFNldHRpbmdzQWZ0ZXJKb2luKGdyb3VwSUQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwicHJvZmlsZSB1cGRhdGVcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJBbGljZSBTbWl0aFwiLFxuICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSB0aGUgbGFuZCBvZiBPelwiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgT3pcIixcbiAgICAgICAgICAgICAgICBsaW5rczogWydodHRwczovL3d3dy53b25kZXJsYW5kLm9yZyddXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9maWxlVXBkYXRlcy5leGVjKHJlcXVlc3QpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBtb2NoYS5ydW4oKG5yRmFpbHVyZXM6IG51bWJlcikgPT4ge1xuXG4gICAgICAgIHN0YXRlLnRlc3RSZXN1bHRXcml0ZXIud3JpdGUobnJGYWlsdXJlcyA9PT0gMClcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byB3cml0ZSByZXN1bHRzOiBcIiwgZXJyKSk7XG5cbiAgICB9KTtcblxufSk7XG4iXX0=