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
const FirebaseTestRunner_1 = require("../../js/firebase/FirebaseTestRunner");
mocha.setup('bdd');
mocha.timeout(10000);
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(this, void 0, void 0, function* () {
    new FirebaseTestRunner_1.FirebaseTestRunner(state).run(() => __awaiter(this, void 0, void 0, function* () {
        console.log("FIXME: running firefase tests...");
    })).catch(err => console.error(err));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSw2RUFBd0U7QUFHeEUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXJCLG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO0lBRWpDLElBQUksdUNBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQVMsRUFBRTtRQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFFcEQsQ0FBQyxDQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFeEMsQ0FBQyxDQUFBLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25SZW5kZXJlcn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvblJlbmRlcmVyJztcbmltcG9ydCB7RmlyZWJhc2VUZXN0UnVubmVyfSBmcm9tICcuLi8uLi9qcy9maXJlYmFzZS9GaXJlYmFzZVRlc3RSdW5uZXInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL2pzL2xvZ2dlci9Mb2dnZXInO1xuXG5tb2NoYS5zZXR1cCgnYmRkJyk7XG5tb2NoYS50aW1lb3V0KDEwMDAwKTtcblxuU3BlY3Ryb25SZW5kZXJlci5ydW4oYXN5bmMgKHN0YXRlKSA9PiB7XG5cbiAgICBuZXcgRmlyZWJhc2VUZXN0UnVubmVyKHN0YXRlKS5ydW4oYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRklYTUU6IHJ1bm5pbmcgZmlyZWZhc2UgdGVzdHMuLi5cIik7XG5cbiAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcblxufSk7XG4iXX0=