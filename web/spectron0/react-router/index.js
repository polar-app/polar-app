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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHVEQUFrRDtBQUNsRCx5RUFBb0U7QUFHcEUsTUFBTSxPQUFPLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDaEcsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUEyQjtJQUVyQztRQUNJLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGFBQWEsRUFBRSxlQUFlO0tBQ2pDO0lBQ0Q7UUFDSSxRQUFRLEVBQUUsR0FBRztRQUNiLGFBQWEsRUFBRSxlQUFlO0tBQ2pDO0NBRUosQ0FBQztBQUVGLHVDQUFrQixDQUFDLEdBQUcsQ0FBQztJQUNuQixPQUFPO0lBQ1AsT0FBTztJQUNQLElBQUksRUFBRSxHQUFHO0lBQ1QsUUFBUTtDQUNYLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3BlY3Ryb25NYWluMn0gZnJvbSAnLi4vLi4vanMvdGVzdC9TcGVjdHJvbk1haW4yJztcbmltcG9ydCB7RG93bmxvYWRJdGVtLCBXZWJDb250ZW50c30gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQge0ZpbGVQYXRoc30gZnJvbSBcIi4uLy4uL2pzL3V0aWwvRmlsZVBhdGhzXCI7XG5pbXBvcnQge1NwZWN0cm9uV2ViYXBwTWFpbn0gZnJvbSBcIi4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25XZWJhcHBNYWluXCI7XG5pbXBvcnQge1Jld3JpdGV9IGZyb20gXCIuLi8uLi9qcy9iYWNrZW5kL3dlYnNlcnZlci9SZXdyaXRlc1wiO1xuXG5jb25zdCB3ZWJSb290ID0gRmlsZVBhdGhzLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCIuLlwiLCBcIndlYlwiLCAnc3BlY3Ryb24wJywgJ3JlYWN0LXJvdXRlcicpO1xuY29uc3QgYXBwUm9vdCA9IF9fZGlybmFtZTtcblxuY29uc3QgcmV3cml0ZXM6IFJlYWRvbmx5QXJyYXk8UmV3cml0ZT4gPSBbXG5cbiAgICB7XG4gICAgICAgIFwic291cmNlXCI6IFwiL3VzZXJcIixcbiAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcIi9jb250ZW50Lmh0bWxcIlxuICAgIH0sXG4gICAge1xuICAgICAgICBcInNvdXJjZVwiOiBcIi9cIixcbiAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcIi9jb250ZW50Lmh0bWxcIlxuICAgIH0sXG5cbl07XG5cblNwZWN0cm9uV2ViYXBwTWFpbi5ydW4oe1xuICAgIHdlYlJvb3QsXG4gICAgYXBwUm9vdCxcbiAgICBwYXRoOiBcIi9cIixcbiAgICByZXdyaXRlc1xufSk7XG4iXX0=