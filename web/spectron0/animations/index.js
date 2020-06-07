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
const ElectronGlobalDatastore_1 = require("../../js/datastore/ElectronGlobalDatastore");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const webRoot = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..");
const appRoot = webRoot;
const rewrites = [
    {
        source: "/",
        destination: "content.html"
    },
];
const datastore = ElectronGlobalDatastore_1.ElectronGlobalDatastore.create();
const path = "/web/spectron0/animations/content.html";
SpectronWebappMain_1.SpectronWebappMain.run({
    initializer: () => __awaiter(void 0, void 0, void 0, function* () { return yield datastore.init(); }),
    webRoot,
    appRoot,
    path,
    rewrites
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlFQUFvRTtBQUNwRSx3RkFBbUY7QUFDbkYsK0RBQTBEO0FBRzFELE1BQU0sT0FBTyxHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUV4QixNQUFNLFFBQVEsR0FBMkI7SUFDckM7UUFDSSxNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxjQUFjO0tBQzlCO0NBQ0osQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHLGlEQUF1QixDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRW5ELE1BQU0sSUFBSSxHQUFHLHdDQUF3QyxDQUFDO0FBRXRELHVDQUFrQixDQUFDLEdBQUcsQ0FBQztJQUNuQixXQUFXLEVBQUUsR0FBUyxFQUFFLGtEQUFDLE9BQUEsTUFBTSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUEsR0FBQTtJQUMvQyxPQUFPO0lBQ1AsT0FBTztJQUNQLElBQUk7SUFDSixRQUFRO0NBQ1gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTcGVjdHJvbldlYmFwcE1haW59IGZyb20gXCIuLi8uLi9qcy90ZXN0L1NwZWN0cm9uV2ViYXBwTWFpblwiO1xuaW1wb3J0IHtFbGVjdHJvbkdsb2JhbERhdGFzdG9yZX0gZnJvbSBcIi4uLy4uL2pzL2RhdGFzdG9yZS9FbGVjdHJvbkdsb2JhbERhdGFzdG9yZVwiO1xuaW1wb3J0IHtGaWxlUGF0aHN9IGZyb20gXCJwb2xhci1zaGFyZWQvc3JjL3V0aWwvRmlsZVBhdGhzXCI7XG5pbXBvcnQge1Jld3JpdGV9IGZyb20gXCJwb2xhci1zaGFyZWQtd2Vic2VydmVyL3NyYy93ZWJzZXJ2ZXIvUmV3cml0ZXNcIjtcblxuY29uc3Qgd2ViUm9vdCA9IEZpbGVQYXRocy5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiLi5cIik7XG5jb25zdCBhcHBSb290ID0gd2ViUm9vdDtcblxuY29uc3QgcmV3cml0ZXM6IFJlYWRvbmx5QXJyYXk8UmV3cml0ZT4gPSBbXG4gICAge1xuICAgICAgICBzb3VyY2U6IFwiL1wiLFxuICAgICAgICBkZXN0aW5hdGlvbjogXCJjb250ZW50Lmh0bWxcIlxuICAgIH0sXG5dO1xuXG5jb25zdCBkYXRhc3RvcmUgPSBFbGVjdHJvbkdsb2JhbERhdGFzdG9yZS5jcmVhdGUoKTtcblxuY29uc3QgcGF0aCA9IFwiL3dlYi9zcGVjdHJvbjAvYW5pbWF0aW9ucy9jb250ZW50Lmh0bWxcIjtcblxuU3BlY3Ryb25XZWJhcHBNYWluLnJ1bih7XG4gICAgaW5pdGlhbGl6ZXI6IGFzeW5jICgpID0+IGF3YWl0IGRhdGFzdG9yZS5pbml0KCksXG4gICAgd2ViUm9vdCxcbiAgICBhcHBSb290LFxuICAgIHBhdGgsXG4gICAgcmV3cml0ZXNcbn0pO1xuIl19