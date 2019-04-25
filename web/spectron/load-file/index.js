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
const electron_1 = require("electron");
const SpectronBrowserWindowOptions_1 = require("../../js/test/SpectronBrowserWindowOptions");
const electron_2 = require("electron");
const windowFactory = () => __awaiter(this, void 0, void 0, function* () {
    const result = new electron_1.BrowserWindow(SpectronBrowserWindowOptions_1.SpectronBrowserWindowOptions.create());
    yield result.loadURL('about:blank');
    return result;
});
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        electron_2.app.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            const window = yield windowFactory();
            console.log("FIXME: showing...");
            window.show();
            console.log("FIXME: showing...done");
            yield window.loadFile(__dirname + '/app.html');
        }));
    });
}
test()
    .catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsdUNBQXVDO0FBQ3ZDLDZGQUF3RjtBQUV4Rix1Q0FBNkI7QUF5QzdCLE1BQU0sYUFBYSxHQUFrQixHQUFTLEVBQUU7SUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBYSxDQUFDLDJEQUE0QixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDeEUsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQSxDQUFDO0FBRUYsU0FBZSxJQUFJOztRQUVmLGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtZQUV2QixNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFckMsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUVuRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUFBO0FBRUQsSUFBSSxFQUFFO0tBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnQsIGV4cGVjdH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3dlYkNvbnRlbnRzfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7U3BlY3Ryb25NYWlufSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uTWFpbic7XG5pbXBvcnQgd2FpdEZvckV4cGVjdCBmcm9tICd3YWl0LWZvci1leHBlY3QnO1xuaW1wb3J0IHtCcm93c2VyV2luZG93c30gZnJvbSAnLi4vLi4vanMvZWxlY3Ryb24vZnJhbWV3b3JrL0Jyb3dzZXJXaW5kb3dzJztcbmltcG9ydCB7QnJvd3NlcldpbmRvd30gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHtTcGVjdHJvbkJyb3dzZXJXaW5kb3dPcHRpb25zfSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uQnJvd3NlcldpbmRvd09wdGlvbnMnO1xuaW1wb3J0IHtXaW5kb3dGYWN0b3J5fSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uTWFpbic7XG5pbXBvcnQge2FwcH0gZnJvbSAnZWxlY3Ryb24nO1xuLy9cbi8vIFNwZWN0cm9uTWFpbi5ydW4oYXN5bmMgc3RhdGUgPT4ge1xuLy9cbi8vICAgICBjb25zb2xlLmxvZyhcIkZJWE1FOiBsb2FkaW5nLi4uXCIpO1xuLy9cbi8vICAgICBhd2FpdCBzdGF0ZS53aW5kb3cubG9hZEZpbGUoX19kaXJuYW1lICsgJy9hcHAuaHRtbCcpO1xuLy8gICAgIGNvbnNvbGUubG9nKFwiRklYTUU6IGxvZGVkOiBcIiArIHN0YXRlLndpbmRvdy53ZWJDb250ZW50cy5nZXRVUkwoKSk7XG4vL1xuLy8gICAgIC8vIHRoZSBvbmx5IG90aGVyIHdheSB0byBnZXQgdGhlIFdlYkNvbnRlbnRzIGZyb20gYSBXZWJ2aWV3XG4vLyAgICAgLy8gaXMgZnJvbSB0aGUgcmVuZGVyZXIgdmlhXG4vLyAgICAgLy9cbi8vICAgICAvLyBsZXQgd2ViVmlldyA9IHdlYkZyYW1lLmdldEZyYW1lRm9yU2VsZWN0b3IoJ3dlYnZpZXcnKTtcbi8vXG4vLyAgICAgYXdhaXQgd2FpdEZvckV4cGVjdCgoKSA9PiB7XG4vLyAgICAgICAgIGFzc2VydC5lcXVhbCh3ZWJDb250ZW50cy5nZXRBbGxXZWJDb250ZW50cygpLmxlbmd0aCwgMik7XG4vLyAgICAgfSk7XG4vL1xuLy8gICAgIGNvbnN0IGFsbFdlYkNvbnRlbnRzID0gd2ViQ29udGVudHMuZ2V0QWxsV2ViQ29udGVudHMoKTtcbi8vXG4vLyAgICAgYXNzZXJ0Lm9rKHdlYkNvbnRlbnRzLmZyb21JZChhbGxXZWJDb250ZW50c1swXS5pZCkpO1xuLy8gICAgIGFzc2VydC5vayh3ZWJDb250ZW50cy5mcm9tSWQoYWxsV2ViQ29udGVudHNbMV0uaWQpKTtcbi8vXG4vLyAgICAgYXdhaXQgd2FpdEZvckV4cGVjdCgoKSA9PiB7XG4vL1xuLy8gICAgICAgICBjb25zdCBsaW5rcyA9IGFsbFdlYkNvbnRlbnRzLm1hcChjdXJyZW50ID0+IGN1cnJlbnQuZ2V0VVJMKCkpLnNvcnQoKTtcbi8vXG4vLyAgICAgICAgIGV4cGVjdChsaW5rc1swXSkudG8uc2F0aXNmeSgoY3VycmVudDogc3RyaW5nKSA9PiBjdXJyZW50LmVuZHNXaXRoKCcvYXBwLmh0bWwnKSk7XG4vLyAgICAgICAgIGV4cGVjdChsaW5rc1sxXSkudG8uc2F0aXNmeSgoY3VycmVudDogc3RyaW5nKSA9PiBjdXJyZW50LmVuZHNXaXRoKCcvZXhhbXBsZS5odG1sJykpO1xuLy9cbi8vICAgICB9KTtcbi8vXG4vLyAgICAgY29uc3Qgd2ViQ29udGVudHNIb3N0SW5kZXggPSBCcm93c2VyV2luZG93cy5jb21wdXRlV2ViQ29udGVudHNUb0hvc3RJbmRleCgpO1xuLy9cbi8vICAgICBhc3NlcnQuZXF1YWwod2ViQ29udGVudHNIb3N0SW5kZXgua2V5cy5sZW5ndGgsIDEpO1xuLy9cbi8vICAgICBhd2FpdCBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKHRydWUpO1xuLy9cbi8vIH0pO1xuXG5cbmNvbnN0IHdpbmRvd0ZhY3Rvcnk6IFdpbmRvd0ZhY3RvcnkgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEJyb3dzZXJXaW5kb3coU3BlY3Ryb25Ccm93c2VyV2luZG93T3B0aW9ucy5jcmVhdGUoKSk7XG4gICAgYXdhaXQgcmVzdWx0LmxvYWRVUkwoJ2Fib3V0OmJsYW5rJyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG5cbiAgICBhcHAub24oJ3JlYWR5JywgYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IGF3YWl0IHdpbmRvd0ZhY3RvcnkoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJGSVhNRTogc2hvd2luZy4uLlwiKTtcbiAgICAgICAgd2luZG93LnNob3coKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJGSVhNRTogc2hvd2luZy4uLmRvbmVcIik7XG5cbiAgICAgICAgYXdhaXQgd2luZG93LmxvYWRGaWxlKF9fZGlybmFtZSArICcvYXBwLmh0bWwnKTtcblxuICAgIH0pO1xufVxuXG50ZXN0KClcbiAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4iXX0=