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
const log = Logger_1.Logger.create();
mocha.setup('bdd');
mocha.timeout(10000);
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
                    const user = app.auth().currentUser;
                    const idToken = yield user.getIdToken();
                    const request = {
                        idToken,
                        request: {
                            docs: [],
                            invitations: {
                                message: "Private invite to my special group",
                                to: [
                                    'getpolarized.test+test1@gmail.com'
                                ]
                            },
                            visibility: 'private'
                        }
                    };
                    yield GroupProvisions_1.GroupProvisions.exec(request);
                });
            });
            it("profile update", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                    const user = app.auth().currentUser;
                    const idToken = yield user.getIdToken();
                    const request = {
                        idToken,
                        request: {
                            name: "Alice Smith",
                            bio: "An example user from the land of Oz",
                            location: "Capitol City, Oz",
                            links: ['https://www.wonderland.org']
                        },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUVoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBYXBELGdGQUEyRTtBQUUzRSw4RUFBeUU7QUFHekUsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVyQixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUNqRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWMsQ0FBQztBQUVqRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUNuRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsQ0FBQztBQUVuRCxTQUFlLFlBQVksQ0FBQyxRQUE0Qjs7UUFFcEQsSUFBSSxNQUFlLENBQUM7UUFFcEIsSUFBSTtZQUVBLE1BQU0sUUFBUSxFQUFFLENBQUM7WUFDakIsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUVsQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksQ0FBRSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDL0M7SUFFTCxDQUFDO0NBQUE7QUFFRCxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtJQUVqQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7O1lBRXhCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTs7b0JBRWxCLE1BQU0sR0FBRyxHQUFHLG1CQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRTVCLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFFMUUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztvQkFFcEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBRXpDLE1BQU0sT0FBTyxHQUF1Qzt3QkFDaEQsT0FBTzt3QkFDUCxPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLEVBQUU7NEJBQ1IsV0FBVyxFQUFFO2dDQUNULE9BQU8sRUFBRSxvQ0FBb0M7Z0NBQzdDLEVBQUUsRUFBRTtvQ0FDQSxtQ0FBbUM7aUNBQ3RDOzZCQUNKOzRCQUNELFVBQVUsRUFBRSxTQUFTO3lCQUN4QjtxQkFDSixDQUFDO29CQUVGLE1BQU0saUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRXhDLENBQUM7YUFBQSxDQUFDLENBQUM7WUFHSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7O29CQUVqQixNQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUU1QixNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRTFFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBRXBDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUV6QyxNQUFNLE9BQU8sR0FBc0M7d0JBQy9DLE9BQU87d0JBQ1AsT0FBTyxFQUFFOzRCQUNMLElBQUksRUFBRSxhQUFhOzRCQUNuQixHQUFHLEVBQUUscUNBQXFDOzRCQUMxQyxRQUFRLEVBQUUsa0JBQWtCOzRCQUM1QixLQUFLLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQzt5QkFDeEM7cUJBQ0osQ0FBQztvQkFFRixNQUFNLCtCQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV2QyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1FBRVAsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFFN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO2FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RSxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge0ZpcmViYXNlRGF0YXN0b3JlfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRmlyZWJhc2VEYXRhc3RvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtGaXJlYmFzZX0gZnJvbSAnLi4vLi4vanMvZmlyZWJhc2UvRmlyZWJhc2UnO1xuaW1wb3J0IHtNb2NrRG9jTWV0YXN9IGZyb20gJy4uLy4uL2pzL21ldGFkYXRhL0RvY01ldGFzJztcbmltcG9ydCB7RG9jUGVybWlzc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NQZXJtaXNzaW9ucyc7XG5pbXBvcnQge1JlY2lwaWVudFRva2VuTWFwfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvZmlyZWJhc2UvRG9jUGVybWlzc2lvbnMnO1xuaW1wb3J0IHtEb2NUb2tlbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NUb2tlbnMnO1xuaW1wb3J0IHtEb2NQZWVyUGVuZGluZ3N9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NQZWVyUGVuZGluZ3MnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtCYWNrZW5kfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvQmFja2VuZCc7XG5pbXBvcnQge0ZpbGVQYXRoc30gZnJvbSAnLi4vLi4vanMvdXRpbC9GaWxlUGF0aHMnO1xuaW1wb3J0IHtGaWxlUmVmfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRGF0YXN0b3JlJztcbmltcG9ydCB7RmlyZWJhc2VEYXRhc3RvcmVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRmlyZWJhc2VEYXRhc3RvcmVzJztcbmltcG9ydCB7RG9jUGVlcn0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL2ZpcmViYXNlL0RvY1BlZXJzJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25SZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVSZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge1Byb2ZpbGVVcGRhdGVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Qcm9maWxlVXBkYXRlcyc7XG5pbXBvcnQge1VzZXJSZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Vc2VyUmVxdWVzdCc7XG5cbmNvbnN0IGxvZyA9IExvZ2dlci5jcmVhdGUoKTtcblxubW9jaGEuc2V0dXAoJ2JkZCcpO1xubW9jaGEudGltZW91dCgxMDAwMCk7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgZGVzY3JpYmUoXCJmaXJlYmFzZS1ncm91cHNcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJncm91cCBwcm92aXNpb25cIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciA9IGFwcC5hdXRoKCkuY3VycmVudFVzZXI7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkVG9rZW4gPSBhd2FpdCB1c2VyIS5nZXRJZFRva2VuKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IFVzZXJSZXF1ZXN0PEdyb3VwUHJvdmlzaW9uUmVxdWVzdD4gPSB7XG4gICAgICAgICAgICAgICAgaWRUb2tlbixcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcml2YXRlIGludml0ZSB0byBteSBzcGVjaWFsIGdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnZXRwb2xhcml6ZWQudGVzdCt0ZXN0MUBnbWFpbC5jb20nXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdwcml2YXRlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF3YWl0IEdyb3VwUHJvdmlzaW9ucy5leGVjKHJlcXVlc3QpO1xuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgaXQoXCJwcm9maWxlIHVwZGF0ZVwiLCBhc3luYyBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYXBwID0gRmlyZWJhc2UuaW5pdCgpO1xuXG4gICAgICAgICAgICBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKEZJUkVCQVNFX1VTRVIsIEZJUkVCQVNFX1BBU1MpO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXBwLmF1dGgoKS5jdXJyZW50VXNlcjtcblxuICAgICAgICAgICAgY29uc3QgaWRUb2tlbiA9IGF3YWl0IHVzZXIhLmdldElkVG9rZW4oKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdDogVXNlclJlcXVlc3Q8UHJvZmlsZVVwZGF0ZVJlcXVlc3Q+ID0ge1xuICAgICAgICAgICAgICAgIGlkVG9rZW4sXG4gICAgICAgICAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkFsaWNlIFNtaXRoXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbzogXCJBbiBleGFtcGxlIHVzZXIgZnJvbSB0aGUgbGFuZCBvZiBPelwiLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogXCJDYXBpdG9sIENpdHksIE96XCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbmtzOiBbJ2h0dHBzOi8vd3d3LndvbmRlcmxhbmQub3JnJ11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvZmlsZVVwZGF0ZXMuZXhlYyhyZXF1ZXN0KTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgbW9jaGEucnVuKChuckZhaWx1cmVzOiBudW1iZXIpID0+IHtcblxuICAgICAgICBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKG5yRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gd3JpdGUgcmVzdWx0czogXCIsIGVycikpO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19