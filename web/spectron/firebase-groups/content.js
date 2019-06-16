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
                    function validateGroupSettings(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const user = app.auth().currentUser;
                            chai_1.assert.equal(user.email, FIREBASE_USER1);
                            console.log("Testing permissions for user: " + user.uid);
                            console.log("Testing permissions for group: " + groupID);
                            const group = yield Groups_1.Groups.get(groupID);
                            chai_1.assert.isDefined(group);
                            chai_1.assert.equal(group.nrMembers, 1);
                        });
                    }
                    yield validateGroupSettings(groupID);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQUU1Qiw4REFBeUQ7QUFFekQsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV0QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksQ0FBRSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDL0M7SUFFTCxDQUFDO0NBQUE7QUFFRCxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtJQVNqQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7O1lBRXhCLEVBQUUsQ0FBQyxpQkFBaUIsRUFB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LEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQzthQUN6QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFdkUsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTcGVjdHJvblJlbmRlcmVyfSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uUmVuZGVyZXInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtGaXJlYmFzZX0gZnJvbSAnLi4vLi4vanMvZmlyZWJhc2UvRmlyZWJhc2UnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvblJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZVJlcXVlc3R9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7UHJvZmlsZVVwZGF0ZXN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL1Byb2ZpbGVVcGRhdGVzJztcbmltcG9ydCB7R3JvdXBKb2luc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBKb2lucyc7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0dyb3VwSURTdHJ9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3Vwcyc7XG5pbXBvcnQge0dyb3Vwc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBzJztcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEyMDAwMCk7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgLy8gVE9ETzogY3JlYXRlIFRXTyBncm91cHMgYW5kIG1ha2Ugc3VyZSB0aGF0IHRoZSB1c2VyIGhhcyBhZG1pbiBvbiB0aG9zZVxuICAgIC8vIGdyb3VwcyBhbmQgdGhhdCB0aGUgcmVjb3JkcyBhcmUgc2V0dXAgcHJvcGVybHkuXG5cbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgbnJNZW1iZXJzIGNvdW50cyBvbiB0aGUgZ3JvdXBzIGFyZSBzZXR1cCBwcm9wZXJseS5cblxuICAgIC8vIFRPRE86IG1ha2Ugc3VyZSBwcm9maWxlIHZhbHVlcyBhcmUgdXBkYXRlZCB0byB0aGUgY29ycmVjdCB2YWx1ZXMgcHJvcGVybHkuXG5cbiAgICBkZXNjcmliZShcImZpcmViYXNlLWdyb3Vwc1wiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdChcImdyb3VwIHByb3Zpc2lvblwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkb0dyb3VwUHJvdmlzaW9uKCkge1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IEdyb3VwUHJvdmlzaW9uUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jczogW10sXG4gICAgICAgICAgICAgICAgICAgIGludml0YXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlByaXZhdGUgaW52aXRlIHRvIG15IHNwZWNpYWwgZ3JvdXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2dldHBvbGFyaXplZC50ZXN0K3Rlc3QxQGdtYWlsLmNvbSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ3ByaXZhdGUnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgR3JvdXBQcm92aXNpb25zLmV4ZWMocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmlkO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwSUQgPSBhd2FpdCBkb0dyb3VwUHJvdmlzaW9uKCk7XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGRvR3JvdXBKb2luKCkge1xuXG4gICAgICAgICAgICAgICAgLy8gbm93IHN3aXRjaCB0byB0aGUgdXNlciB0aGF0IHdhcyBpbnZpdGVkIGFuZCBqb2luIHRoYXQgZ3JvdXAuXG5cbiAgICAgICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIxLCBGSVJFQkFTRV9QQVNTMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlVXBkYXRlUmVxdWVzdDogUHJvZmlsZVVwZGF0ZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQm9iIEpvaG5zb25cIixcbiAgICAgICAgICAgICAgICAgICAgYmlvOiBcIkFuIGV4YW1wbGUgdXNlciBmcm9tIE1hcnNcIixcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IFwiQ2FwaXRvbCBDaXR5LCBNYXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3Lm1hcnMub3JnJ11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvZmlsZVVwZGF0ZXMuZXhlYyhwcm9maWxlVXBkYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBHcm91cEpvaW5zLmV4ZWMoe2dyb3VwSUR9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBkb0dyb3VwSm9pbigpO1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZUdyb3VwU2V0dGluZ3MoZ3JvdXBJRDogR3JvdXBJRFN0cikge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IGFwcC5hdXRoKCkuY3VycmVudFVzZXIhO1xuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbCh1c2VyLmVtYWlsLCBGSVJFQkFTRV9VU0VSMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlc3RpbmcgcGVybWlzc2lvbnMgZm9yIHVzZXI6IFwiICsgdXNlci51aWQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVzdGluZyBwZXJtaXNzaW9ucyBmb3IgZ3JvdXA6IFwiICsgZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cCA9IGF3YWl0IEdyb3Vwcy5nZXQoZ3JvdXBJRCk7XG5cbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNEZWZpbmVkKGdyb3VwKTtcblxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChncm91cCEubnJNZW1iZXJzLCAxKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZUdyb3VwU2V0dGluZ3MoZ3JvdXBJRCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJwcm9maWxlIHVwZGF0ZVwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBQcm9maWxlVXBkYXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkFsaWNlIFNtaXRoXCIsXG4gICAgICAgICAgICAgICAgYmlvOiBcIkFuIGV4YW1wbGUgdXNlciBmcm9tIHRoZSBsYW5kIG9mIE96XCIsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IFwiQ2FwaXRvbCBDaXR5LCBPelwiLFxuICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3LndvbmRlcmxhbmQub3JnJ11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocmVxdWVzdCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIG1vY2hhLnJ1bigobnJGYWlsdXJlczogbnVtYmVyKSA9PiB7XG5cbiAgICAgICAgc3RhdGUudGVzdFJlc3VsdFdyaXRlci53cml0ZShuckZhaWx1cmVzID09PSAwKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHdyaXRlIHJlc3VsdHM6IFwiLCBlcnIpKTtcblxuICAgIH0pO1xuXG59KTtcbiJdfQ==