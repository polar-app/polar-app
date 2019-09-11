"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilePaths_1 = require("../../js/util/FilePaths");
const SpectronWebappMain_1 = require("../../js/test/SpectronWebappMain");
const webRoot = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..", "web", 'spectron0', 'react-router');
const appRoot = __dirname;
const rewrites = [
    {
        "source": "/user",
        "destination": "/content.html"
    },
    {
        "source": "/",
        "destination": "/content.html"
    },
];
SpectronWebappMain_1.SpectronWebappMain.run({
    webRoot,
    appRoot,
    path: "/",
    rewrites
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHVEQUFrRDtBQUNsRCx5RUFBb0U7QUFHcEUsTUFBTSxPQUFPLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDaEcsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUEyQjtJQUVyQztRQUNJLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGFBQWEsRUFBRSxlQUFlO0tBQ2pDO0lBQ0Q7UUFDSSxRQUFRLEVBQUUsR0FBRztRQUNiLGFBQWEsRUFBRSxlQUFlO0tBQ2pDO0NBRUosQ0FBQztBQUVGLHVDQUFrQixDQUFDLEdBQUcsQ0FBQztJQUNuQixPQUFPO0lBQ1AsT0FBTztJQUNQLElBQUksRUFBRSxHQUFHO0lBQ1QsUUFBUTtDQUNYLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25NYWluMn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvbk1haW4yJztcbmltcG9ydCB7RG93bmxvYWRJdGVtLCBXZWJDb250ZW50c30gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQge0ZpbGVQYXRoc30gZnJvbSBcIi4uLy4uL2pzL3V0aWwvRmlsZVBhdGhzXCI7XG5pbXBvcnQge1NwZWN0cm9uV2ViYXBwTWFpbn0gZnJvbSBcIi4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25XZWJhcHBNYWluXCI7XG5pbXBvcnQge1Jld3JpdGV9IGZyb20gXCJwb2xhci1zaGFyZWQtd2Vic2VydmVyL3NyYy93ZWJzZXJ2ZXIvUmV3cml0ZXNcIjtcblxuY29uc3Qgd2ViUm9vdCA9IEZpbGVQYXRocy5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiLi5cIiwgXCJ3ZWJcIiwgJ3NwZWN0cm9uMCcsICdyZWFjdC1yb3V0ZXInKTtcbmNvbnN0IGFwcFJvb3QgPSBfX2Rpcm5hbWU7XG5cbmNvbnN0IHJld3JpdGVzOiBSZWFkb25seUFycmF5PFJld3JpdGU+ID0gW1xuXG4gICAge1xuICAgICAgICBcInNvdXJjZVwiOiBcIi91c2VyXCIsXG4gICAgICAgIFwiZGVzdGluYXRpb25cIjogXCIvY29udGVudC5odG1sXCJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgXCJzb3VyY2VcIjogXCIvXCIsXG4gICAgICAgIFwiZGVzdGluYXRpb25cIjogXCIvY29udGVudC5odG1sXCJcbiAgICB9LFxuXG5dO1xuXG5TcGVjdHJvbldlYmFwcE1haW4ucnVuKHtcbiAgICB3ZWJSb290LFxuICAgIGFwcFJvb3QsXG4gICAgcGF0aDogXCIvXCIsXG4gICAgcmV3cml0ZXNcbn0pO1xuIl19