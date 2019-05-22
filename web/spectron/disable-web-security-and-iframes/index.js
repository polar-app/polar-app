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
electron_1.app.commandLine.appendSwitch('disable-site-isolation-trials');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0RBQTBEO0FBQzFELHVDQUE0QztBQUU1QyxjQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRTlELFNBQWUsb0JBQW9COztRQUUvQixNQUFNLE9BQU8sR0FBRztZQUVaLGVBQWUsRUFBRSxNQUFNO1lBUXZCLElBQUksRUFBRSxJQUFJO1lBRVYsY0FBYyxFQUFFO2dCQUNaLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixlQUFlLEVBQUUsSUFBSTtnQkFDckIsU0FBUyxFQUFFLGtCQUFrQjtnQkFDN0IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixvQkFBb0IsRUFBRSw4S0FBOEs7YUFDdk07U0FFSixDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV2RCxNQUFNLFVBQVUsR0FBRyxJQUFJLHdCQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7Q0FBQTtBQUVELDZCQUFhLENBQUMsTUFBTSxDQUFDLEVBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBTSxLQUFLLEVBQUMsRUFBRTtJQUUxRSxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxFQUFFLEVBQUMsWUFBWSxFQUFFLDhCQUE4QixFQUFDLENBQUMsQ0FBQztJQU1oSCxNQUFNLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFN0MsQ0FBQyxDQUFBLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25NYWluMn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvbk1haW4yJztcbmltcG9ydCB7YXBwLCBCcm93c2VyV2luZG93fSBmcm9tICdlbGVjdHJvbic7XG5cbmFwcC5jb21tYW5kTGluZS5hcHBlbmRTd2l0Y2goJ2Rpc2FibGUtc2l0ZS1pc29sYXRpb24tdHJpYWxzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRXaW5kb3dGYWN0b3J5KCk6IFByb21pc2U8QnJvd3NlcldpbmRvdz4ge1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcblxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGJyxcblxuICAgICAgICAvLyBOT1RFOiB0aGUgZGVmYXVsdCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZG4ndCBiZSBjaGFuZ2VkIGhlcmUgYXMgaXQgY2FuXG4gICAgICAgIC8vIGJyZWFrIHVuaXQgdGVzdHMuXG5cbiAgICAgICAgLy8gd2lkdGg6IDEwMDAsXG4gICAgICAgIC8vIGhlaWdodDogMTAwMCxcblxuICAgICAgICBzaG93OiB0cnVlLFxuXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgICB3ZWJTZWN1cml0eTogZmFsc2UsXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwYXJ0aXRpb246IFwicGVyc2lzdDpzcGVjdHJvblwiLFxuICAgICAgICAgICAgd2Vidmlld1RhZzogdHJ1ZSxcbiAgICAgICAgICAgIG9mZnNjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICBkaXNhYmxlQmxpbmtGZWF0dXJlczogXCJTaXRlUGVyUHJvY2VzcyxPcmlnaW5UcmlhbHMsT3JpZ2luVHJpYWxzU2FtcGxlQVBJLE9yaWdpblRyaWFsc1NhbXBsZUFQSURlcGVuZGVudCxPcmlnaW5UcmlhbHNTYW1wbGVBUElJbXBsaWVkLE9yaWdpblRyaWFsc1NhbXBsZUFQSUludmFsaWRPUyxPcmlnaW5UcmlhbHNTYW1wbGVBUElOYXZpZ2F0aW9uXCJcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgd2luZG93IHdpdGggb3B0aW9uczogXCIsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KG9wdGlvbnMpO1xuICAgIGF3YWl0IG1haW5XaW5kb3cubG9hZFVSTCgnYWJvdXQ6YmxhbmsnKTtcblxuICAgIHJldHVybiBtYWluV2luZG93O1xufVxuXG5TcGVjdHJvbk1haW4yLmNyZWF0ZSh7d2luZG93RmFjdG9yeTogZGVmYXVsdFdpbmRvd0ZhY3Rvcnl9KS5ydW4oYXN5bmMgc3RhdGUgPT4ge1xuXG4gICAgYXdhaXQgc3RhdGUud2luZG93LmxvYWRVUkwoYGh0dHBzOi8va3lzby5pby9LeWxlT1MvbmJlc3RpbWF0ZWAsIHtleHRyYUhlYWRlcnM6IFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3k6ICcqJ1wifSk7XG5cblxuICAgIC8vIGF3YWl0IHN0YXRlLndpbmRvdy5sb2FkVVJMKGBodHRwczovL2dldHBvbGFyaXplZC5pby9jYXB0dXJlLWRlYnVnL2lmcmFtZS0xLmh0bWxgLCB7ZXh0cmFIZWFkZXJzOiBcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5OiAnKidcIn0pO1xuICAgIC8vXG5cbiAgICBhd2FpdCBzdGF0ZS50ZXN0UmVzdWx0V3JpdGVyLndyaXRlKHRydWUpO1xuXG59KTtcblxuIl19