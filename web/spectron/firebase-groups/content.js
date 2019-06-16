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
                    const groupID = response.id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBRXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFDekUsc0VBQWlFO0FBRWpFLE1BQU0sR0FBRyxHQUFHLGVBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU1QixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFdEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFjLENBQUM7QUFDakQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFjLENBQUM7QUFFakQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLENBQUM7QUFDbkQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLENBQUM7QUFFbkQsU0FBZSxZQUFZLENBQUMsUUFBNEI7O1FBRXBELElBQUksTUFBZSxDQUFDO1FBRXBCLElBQUk7WUFFQSxNQUFNLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FFbEI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUUsTUFBTSxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQy9DO0lBRUwsQ0FBQztDQUFBO0FBRUQsbUNBQWdCLENBQUMsR0FBRyxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7SUFTakMsUUFBUSxDQUFDLGlCQUFpQixFQUFFOztZQUV4QixFQUFFLENBQUMsaUJBQWlCLEVBQUU7O29CQUVsQixNQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUU1QixNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRTFFLE1BQU0sT0FBTyxHQUEwQjt3QkFDbkMsSUFBSSxFQUFFLEVBQUU7d0JBQ1IsV0FBVyxFQUFFOzRCQUNULE9BQU8sRUFBRSxvQ0FBb0M7NEJBQzdDLEVBQUUsRUFBRTtnQ0FDQSxtQ0FBbUM7NkJBQ3RDO3lCQUNKO3dCQUNELFVBQVUsRUFBRSxTQUFTO3FCQUN4QixDQUFDO29CQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0saUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXJELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBSTVCLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFFNUUsTUFBTSxvQkFBb0IsR0FBeUI7d0JBQy9DLElBQUksRUFBRSxhQUFhO3dCQUNuQixHQUFHLEVBQUUsMkJBQTJCO3dCQUNoQyxRQUFRLEVBQUUsb0JBQW9CO3dCQUM5QixLQUFLLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztxQkFDbEMsQ0FBQztvQkFFRixNQUFNLCtCQUFjLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBRWhELE1BQU0sdUJBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO2dCQUVyQyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFOztvQkFFakIsTUFBTSxHQUFHLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFNUIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUUxRSxNQUFNLE9BQU8sR0FBeUI7d0JBQ2xDLElBQUksRUFBRSxhQUFhO3dCQUNuQixHQUFHLEVBQUUscUNBQXFDO3dCQUMxQyxRQUFRLEVBQUUsa0JBQWtCO3dCQUM1QixLQUFLLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztxQkFDeEMsQ0FBQztvQkFFRixNQUFNLCtCQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV2QyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1FBRVAsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFFN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO2FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RSxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vanMvbG9nZ2VyL0xvZ2dlcic7XG5pbXBvcnQge0ZpcmViYXNlfSBmcm9tICcuLi8uLi9qcy9maXJlYmFzZS9GaXJlYmFzZSc7XG5pbXBvcnQge0dyb3VwUHJvdmlzaW9uUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvR3JvdXBQcm92aXNpb25zJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlUmVxdWVzdH0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtQcm9maWxlVXBkYXRlc30gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL3NoYXJpbmcvUHJvZmlsZVVwZGF0ZXMnO1xuaW1wb3J0IHtHcm91cEpvaW5zfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cEpvaW5zJztcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEyMDAwMCk7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgLy8gVE9ETzogY3JlYXRlIFRXTyBncm91cHMgYW5kIG1ha2Ugc3VyZSB0aGF0IHRoZSB1c2VyIGhhcyBhZG1pbiBvbiB0aG9zZVxuICAgIC8vIGdyb3VwcyBhbmQgdGhhdCB0aGUgcmVjb3JkcyBhcmUgc2V0dXAgcHJvcGVybHkuXG5cbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgbnJNZW1iZXJzIGNvdW50cyBvbiB0aGUgZ3JvdXBzIGFyZSBzZXR1cCBwcm9wZXJseS5cblxuICAgIC8vIFRPRE86IG1ha2Ugc3VyZSBwcm9maWxlIHZhbHVlcyBhcmUgdXBkYXRlZCB0byB0aGUgY29ycmVjdCB2YWx1ZXMgcHJvcGVybHkuXG5cbiAgICBkZXNjcmliZShcImZpcmViYXNlLWdyb3Vwc1wiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdChcImdyb3VwIHByb3Zpc2lvblwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0OiBHcm91cFByb3Zpc2lvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgZG9jczogW10sXG4gICAgICAgICAgICAgICAgaW52aXRhdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcml2YXRlIGludml0ZSB0byBteSBzcGVjaWFsIGdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnZ2V0cG9sYXJpemVkLnRlc3QrdGVzdDFAZ21haWwuY29tJ1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAncHJpdmF0ZSdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgR3JvdXBQcm92aXNpb25zLmV4ZWMocmVxdWVzdCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwSUQgPSByZXNwb25zZS5pZDtcblxuICAgICAgICAgICAgLy8gbm93IHN3aXRjaCB0byB0aGUgdXNlciB0aGF0IHdhcyBpbnZpdGVkIGFuZCBqb2luIHRoYXQgZ3JvdXAuXG5cbiAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUjEsIEZJUkVCQVNFX1BBU1MxKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvZmlsZVVwZGF0ZVJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiQm9iIEpvaG5zb25cIixcbiAgICAgICAgICAgICAgICBiaW86IFwiQW4gZXhhbXBsZSB1c2VyIGZyb20gTWFyc1wiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcIkNhcGl0b2wgQ2l0eSwgTWFyc1wiLFxuICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3Lm1hcnMub3JnJ11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF3YWl0IFByb2ZpbGVVcGRhdGVzLmV4ZWMocHJvZmlsZVVwZGF0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICBhd2FpdCBHcm91cEpvaW5zLmV4ZWMoe2dyb3VwSUR9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInByb2ZpbGUgdXBkYXRlXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBGaXJlYmFzZS5pbml0KCk7XG5cbiAgICAgICAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoRklSRUJBU0VfVVNFUiwgRklSRUJBU0VfUEFTUyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IFByb2ZpbGVVcGRhdGVSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiQWxpY2UgU21pdGhcIixcbiAgICAgICAgICAgICAgICBiaW86IFwiQW4gZXhhbXBsZSB1c2VyIGZyb20gdGhlIGxhbmQgb2YgT3pcIixcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogXCJDYXBpdG9sIENpdHksIE96XCIsXG4gICAgICAgICAgICAgICAgbGlua3M6IFsnaHR0cHM6Ly93d3cud29uZGVybGFuZC5vcmcnXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvZmlsZVVwZGF0ZXMuZXhlYyhyZXF1ZXN0KTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgbW9jaGEucnVuKChuckZhaWx1cmVzOiBudW1iZXIpID0+IHtcblxuICAgICAgICBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKG5yRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gd3JpdGUgcmVzdWx0czogXCIsIGVycikpO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19