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
                        docs: [],
                        invitations: {
                            message: "Private invite to my special group",
                            to: [
                                'getpolarized.test+test1@gmail.com'
                            ]
                        },
                        visibility: 'private'
                    };
                    yield GroupProvisions_1.GroupProvisions.exec(request);
                });
            });
        });
    });
    mocha.run((nrFailures) => {
        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUVoRSxtREFBOEM7QUFDOUMseURBQW9EO0FBYXBELGdGQUEyRTtBQUUzRSxNQUFNLEdBQUcsR0FBRyxlQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFNUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXJCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYyxDQUFDO0FBQ2pELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYyxDQUFDO0FBRWpELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxDQUFDO0FBQ25ELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxDQUFDO0FBRW5ELFNBQWUsWUFBWSxDQUFDLFFBQTRCOztRQUVwRCxJQUFJLE1BQWUsQ0FBQztRQUVwQixJQUFJO1lBRUEsTUFBTSxRQUFRLEVBQUUsQ0FBQztZQUNqQixNQUFNLEdBQUcsS0FBSyxDQUFDO1NBRWxCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxDQUFFLE1BQU0sRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUMvQztJQUVMLENBQUM7Q0FBQTtBQUVELG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO0lBRWpDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTs7WUFFeEIsRUFBRSxDQUFDLGlCQUFpQixFQUFFOztvQkFFbEIsTUFBTSxHQUFHLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFNUIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUUxRSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO29CQUVwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFFekMsTUFBTSxPQUFPLEdBQTBCO3dCQUNuQyxPQUFPO3dCQUNQLElBQUksRUFBRSxFQUFFO3dCQUNSLFdBQVcsRUFBRTs0QkFDVCxPQUFPLEVBQUUsb0NBQW9DOzRCQUM3QyxFQUFFLEVBQUU7Z0NBQ0EsbUNBQW1DOzZCQUN0Qzt5QkFDSjt3QkFDRCxVQUFVLEVBQUUsU0FBUztxQkFDeEIsQ0FBQztvQkFFRixNQUFNLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV4QyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1FBRVAsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFFN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO2FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RSxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQge0ZpcmViYXNlRGF0YXN0b3JlfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRmlyZWJhc2VEYXRhc3RvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtGaXJlYmFzZX0gZnJvbSAnLi4vLi4vanMvZmlyZWJhc2UvRmlyZWJhc2UnO1xuaW1wb3J0IHtNb2NrRG9jTWV0YXN9IGZyb20gJy4uLy4uL2pzL21ldGFkYXRhL0RvY01ldGFzJztcbmltcG9ydCB7RG9jUGVybWlzc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NQZXJtaXNzaW9ucyc7XG5pbXBvcnQge1JlY2lwaWVudFRva2VuTWFwfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvZmlyZWJhc2UvRG9jUGVybWlzc2lvbnMnO1xuaW1wb3J0IHtEb2NUb2tlbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NUb2tlbnMnO1xuaW1wb3J0IHtEb2NQZWVyUGVuZGluZ3N9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9maXJlYmFzZS9Eb2NQZWVyUGVuZGluZ3MnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtCYWNrZW5kfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvQmFja2VuZCc7XG5pbXBvcnQge0ZpbGVQYXRoc30gZnJvbSAnLi4vLi4vanMvdXRpbC9GaWxlUGF0aHMnO1xuaW1wb3J0IHtGaWxlUmVmfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRGF0YXN0b3JlJztcbmltcG9ydCB7RmlyZWJhc2VEYXRhc3RvcmVzfSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvRmlyZWJhc2VEYXRhc3RvcmVzJztcbmltcG9ydCB7RG9jUGVlcn0gZnJvbSAnLi4vLi4vanMvZGF0YXN0b3JlL2ZpcmViYXNlL0RvY1BlZXJzJztcbmltcG9ydCB7R3JvdXBQcm92aXNpb25SZXF1ZXN0fSBmcm9tICcuLi8uLi9qcy9kYXRhc3RvcmUvc2hhcmluZy9Hcm91cFByb3Zpc2lvbnMnO1xuaW1wb3J0IHtHcm91cFByb3Zpc2lvbnN9IGZyb20gJy4uLy4uL2pzL2RhdGFzdG9yZS9zaGFyaW5nL0dyb3VwUHJvdmlzaW9ucyc7XG5cbmNvbnN0IGxvZyA9IExvZ2dlci5jcmVhdGUoKTtcblxubW9jaGEuc2V0dXAoJ2JkZCcpO1xubW9jaGEudGltZW91dCgxMDAwMCk7XG5cbmNvbnN0IEZJUkVCQVNFX1VTRVIgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSITtcbmNvbnN0IEZJUkVCQVNFX1BBU1MgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QQVNTITtcblxuY29uc3QgRklSRUJBU0VfVVNFUjEgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9VU0VSMSE7XG5jb25zdCBGSVJFQkFTRV9QQVNTMSA9IHByb2Nlc3MuZW52LkZJUkVCQVNFX1BBU1MxITtcblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5RmFpbGVkKGRlbGVnYXRlOiAoKSA9PiBQcm9taXNlPGFueT4pIHtcblxuICAgIGxldCBmYWlsZWQ6IGJvb2xlYW47XG5cbiAgICB0cnkge1xuXG4gICAgICAgIGF3YWl0IGRlbGVnYXRlKCk7XG4gICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIGZhaWxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZhaWwgYXMgZXhwZWN0ZWRcIik7XG4gICAgfVxuXG59XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jIChzdGF0ZSkgPT4ge1xuXG4gICAgZGVzY3JpYmUoXCJmaXJlYmFzZS1ncm91cHNcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJncm91cCBwcm92aXNpb25cIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IEZpcmViYXNlLmluaXQoKTtcblxuICAgICAgICAgICAgYXdhaXQgYXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChGSVJFQkFTRV9VU0VSLCBGSVJFQkFTRV9QQVNTKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciA9IGFwcC5hdXRoKCkuY3VycmVudFVzZXI7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkVG9rZW4gPSBhd2FpdCB1c2VyIS5nZXRJZFRva2VuKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3Q6IEdyb3VwUHJvdmlzaW9uUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBpZFRva2VuLFxuICAgICAgICAgICAgICAgIGRvY3M6IFtdLFxuICAgICAgICAgICAgICAgIGludml0YXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUHJpdmF0ZSBpbnZpdGUgdG8gbXkgc3BlY2lhbCBncm91cFwiLFxuICAgICAgICAgICAgICAgICAgICB0bzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2dldHBvbGFyaXplZC50ZXN0K3Rlc3QxQGdtYWlsLmNvbSdcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ3ByaXZhdGUnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBHcm91cFByb3Zpc2lvbnMuZXhlYyhyZXF1ZXN0KTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgbW9jaGEucnVuKChuckZhaWx1cmVzOiBudW1iZXIpID0+IHtcblxuICAgICAgICBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKG5yRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gd3JpdGUgcmVzdWx0czogXCIsIGVycikpO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19