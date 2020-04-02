"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronWebappMain_1 = require("../../js/test/SpectronWebappMain");
const MainDatastore_1 = require("../../js/datastore/MainDatastore");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const webRoot = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..");
const appRoot = webRoot;
const rewrites = [
    {
        source: "/",
        destination: "content.html"
    },
];
const datastore = MainDatastore_1.MainDatastore.create();
const path = "/web/spectron0/animations/content.html";
SpectronWebappMain_1.SpectronWebappMain.run({
    initializer: () => __awaiter(void 0, void 0, void 0, function* () { return yield datastore.init(); }),
    webRoot,
    appRoot,
    path,
    rewrites
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlFQUFvRTtBQUNwRSxvRUFBK0Q7QUFDL0QsK0RBQTBEO0FBRzFELE1BQU0sT0FBTyxHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUV4QixNQUFNLFFBQVEsR0FBMkI7SUFDckM7UUFDSSxNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxjQUFjO0tBQzlCO0NBQ0osQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHLDZCQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFekMsTUFBTSxJQUFJLEdBQUcsd0NBQXdDLENBQUM7QUFFdEQsdUNBQWtCLENBQUMsR0FBRyxDQUFDO0lBQ25CLFdBQVcsRUFBRSxHQUFTLEVBQUUsa0RBQUMsT0FBQSxNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxHQUFBO0lBQy9DLE9BQU87SUFDUCxPQUFPO0lBQ1AsSUFBSTtJQUNKLFFBQVE7Q0FDWCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uV2ViYXBwTWFpbn0gZnJvbSBcIi4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25XZWJhcHBNYWluXCI7XG5pbXBvcnQge01haW5EYXRhc3RvcmV9IGZyb20gXCIuLi8uLi9qcy9kYXRhc3RvcmUvTWFpbkRhdGFzdG9yZVwiO1xuaW1wb3J0IHtGaWxlUGF0aHN9IGZyb20gXCJwb2xhci1zaGFyZWQvc3JjL3V0aWwvRmlsZVBhdGhzXCI7XG5pbXBvcnQge1Jld3JpdGV9IGZyb20gXCJwb2xhci1zaGFyZWQtd2Vic2VydmVyL3NyYy93ZWJzZXJ2ZXIvUmV3cml0ZXNcIjtcblxuY29uc3Qgd2ViUm9vdCA9IEZpbGVQYXRocy5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiLi5cIik7XG5jb25zdCBhcHBSb290ID0gd2ViUm9vdDtcblxuY29uc3QgcmV3cml0ZXM6IFJlYWRvbmx5QXJyYXk8UmV3cml0ZT4gPSBbXG4gICAge1xuICAgICAgICBzb3VyY2U6IFwiL1wiLFxuICAgICAgICBkZXN0aW5hdGlvbjogXCJjb250ZW50Lmh0bWxcIlxuICAgIH0sXG5dO1xuXG5jb25zdCBkYXRhc3RvcmUgPSBNYWluRGF0YXN0b3JlLmNyZWF0ZSgpO1xuXG5jb25zdCBwYXRoID0gXCIvd2ViL3NwZWN0cm9uMC9hbmltYXRpb25zL2NvbnRlbnQuaHRtbFwiO1xuXG5TcGVjdHJvbldlYmFwcE1haW4ucnVuKHtcbiAgICBpbml0aWFsaXplcjogYXN5bmMgKCkgPT4gYXdhaXQgZGF0YXN0b3JlLmluaXQoKSxcbiAgICB3ZWJSb290LFxuICAgIGFwcFJvb3QsXG4gICAgcGF0aCxcbiAgICByZXdyaXRlc1xufSk7XG4iXX0=