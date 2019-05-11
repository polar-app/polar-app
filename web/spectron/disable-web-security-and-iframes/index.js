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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const electron_1 = require("electron");
function defaultWindowFactory() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            backgroundColor: '#FFF',
            show: true,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                partition: "persist:spectron",
                webviewTag: true,
                offscreen: false,
                disableBlinkFeatures: "SitePerProcess,OriginTrials,OriginTrialsSampleAPI,OriginTrialsSampleAPIDependent,OriginTrialsSampleAPIImplied,OriginTrialsSampleAPIInvalidOS,OriginTrialsSampleAPINavigation"
            }
        };
        console.log("Creating window with options: ", options);
        const mainWindow = new electron_1.BrowserWindow(options);
        yield mainWindow.loadURL('about:blank');
        return mainWindow;
    });
}
SpectronMain2_1.SpectronMain2.create({ windowFactory: defaultWindowFactory }).run((state) => __awaiter(this, void 0, void 0, function* () {
    yield state.window.loadURL(`https://kyso.io/KyleOS/nbestimate`, { extraHeaders: "Content-Security-Policy: '*'" });
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0RBQTBEO0FBQzFELHVDQUF1QztBQUV2QyxTQUFlLG9CQUFvQjs7UUFFL0IsTUFBTSxPQUFPLEdBQUc7WUFFWixlQUFlLEVBQUUsTUFBTTtZQVF2QixJQUFJLEVBQUUsSUFBSTtZQUVWLGNBQWMsRUFBRTtnQkFDWixXQUFXLEVBQUUsS0FBSztnQkFDbEIsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsb0JBQW9CLEVBQUUsOEtBQThLO2FBQ3ZNO1NBRUosQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkQsTUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0NBQUE7QUFFRCw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQU0sS0FBSyxFQUFDLEVBQUU7SUFFMUUsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBRSxFQUFDLFlBQVksRUFBRSw4QkFBOEIsRUFBQyxDQUFDLENBQUM7SUFNaEgsTUFBTSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTdDLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uTWFpbjJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25NYWluMic7XG5pbXBvcnQge0Jyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdFdpbmRvd0ZhY3RvcnkoKTogUHJvbWlzZTxCcm93c2VyV2luZG93PiB7XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkYnLFxuXG4gICAgICAgIC8vIE5PVEU6IHRoZSBkZWZhdWx0IHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkbid0IGJlIGNoYW5nZWQgaGVyZSBhcyBpdCBjYW5cbiAgICAgICAgLy8gYnJlYWsgdW5pdCB0ZXN0cy5cblxuICAgICAgICAvLyB3aWR0aDogMTAwMCxcbiAgICAgICAgLy8gaGVpZ2h0OiAxMDAwLFxuXG4gICAgICAgIHNob3c6IHRydWUsXG5cbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgICAgIHdlYlNlY3VyaXR5OiBmYWxzZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHBhcnRpdGlvbjogXCJwZXJzaXN0OnNwZWN0cm9uXCIsXG4gICAgICAgICAgICB3ZWJ2aWV3VGFnOiB0cnVlLFxuICAgICAgICAgICAgb2Zmc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc2FibGVCbGlua0ZlYXR1cmVzOiBcIlNpdGVQZXJQcm9jZXNzLE9yaWdpblRyaWFscyxPcmlnaW5UcmlhbHNTYW1wbGVBUEksT3JpZ2luVHJpYWxzU2FtcGxlQVBJRGVwZW5kZW50LE9yaWdpblRyaWFsc1NhbXBsZUFQSUltcGxpZWQsT3JpZ2luVHJpYWxzU2FtcGxlQVBJSW52YWxpZE9TLE9yaWdpblRyaWFsc1NhbXBsZUFQSU5hdmlnYXRpb25cIlxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coXCJDcmVhdGluZyB3aW5kb3cgd2l0aCBvcHRpb25zOiBcIiwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3cob3B0aW9ucyk7XG4gICAgYXdhaXQgbWFpbldpbmRvdy5sb2FkVVJMKCdhYm91dDpibGFuaycpO1xuXG4gICAgcmV0dXJuIG1haW5XaW5kb3c7XG59XG5cblNwZWN0cm9uTWFpbjIuY3JlYXRlKHt3aW5kb3dGYWN0b3J5OiBkZWZhdWx0V2luZG93RmFjdG9yeX0pLnJ1bihhc3luYyBzdGF0ZSA9PiB7XG5cbiAgICBhd2FpdCBzdGF0ZS53aW5kb3cubG9hZFVSTChgaHR0cHM6Ly9reXNvLmlvL0t5bGVPUy9uYmVzdGltYXRlYCwge2V4dHJhSGVhZGVyczogXCJDb250ZW50LVNlY3VyaXR5LVBvbGljeTogJyonXCJ9KTtcblxuXG4gICAgLy8gYXdhaXQgc3RhdGUud2luZG93LmxvYWRVUkwoYGh0dHBzOi8vZ2V0cG9sYXJpemVkLmlvL2NhcHR1cmUtZGVidWcvaWZyYW1lLTEuaHRtbGAsIHtleHRyYUhlYWRlcnM6IFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3k6ICcqJ1wifSk7XG4gICAgLy9cblxuICAgIGF3YWl0IHN0YXRlLnRlc3RSZXN1bHRXcml0ZXIud3JpdGUodHJ1ZSk7XG5cbn0pO1xuXG4iXX0=