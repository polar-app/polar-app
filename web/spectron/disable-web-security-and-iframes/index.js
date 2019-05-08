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
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(this, void 0, void 0, function* () {
    yield state.window.loadURL(`https://kyso.io/KyleOS/nbestimate`, { extraHeaders: "Content-Security-Policy: '*'" });
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0RBQTBEO0FBRTFELDZCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQU0sS0FBSyxFQUFDLEVBQUU7SUFFckMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBRSxFQUFDLFlBQVksRUFBRSw4QkFBOEIsRUFBQyxDQUFDLENBQUM7SUFNaEgsTUFBTSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTdDLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uTWFpbjJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25NYWluMic7XG5cblNwZWN0cm9uTWFpbjIuY3JlYXRlKCkucnVuKGFzeW5jIHN0YXRlID0+IHtcblxuICAgIGF3YWl0IHN0YXRlLndpbmRvdy5sb2FkVVJMKGBodHRwczovL2t5c28uaW8vS3lsZU9TL25iZXN0aW1hdGVgLCB7ZXh0cmFIZWFkZXJzOiBcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5OiAnKidcIn0pO1xuXG5cbiAgICAvLyBhd2FpdCBzdGF0ZS53aW5kb3cubG9hZFVSTChgaHR0cHM6Ly9nZXRwb2xhcml6ZWQuaW8vY2FwdHVyZS1kZWJ1Zy9pZnJhbWUtMS5odG1sYCwge2V4dHJhSGVhZGVyczogXCJDb250ZW50LVNlY3VyaXR5LVBvbGljeTogJyonXCJ9KTtcbiAgICAvL1xuXG4gICAgYXdhaXQgc3RhdGUudGVzdFJlc3VsdFdyaXRlci53cml0ZSh0cnVlKTtcblxufSk7XG5cbiJdfQ==