"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = require("./Navbar");
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", { style: { margin: '5px' } },
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/#hello' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the hello URL")),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the default page.")),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/user' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the user page"))))));
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsdURBQWdGO0FBRWhGLHFDQUFnQztBQUVoQyxNQUFNLEdBQU8sU0FBUSxLQUFLLENBQUMsU0FBd0I7SUFFL0MsWUFBWSxLQUFRLEVBQUUsT0FBWTtRQUM5QixLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFCLENBQUM7SUFFTSxNQUFNO1FBRVQsT0FBTyxDQUVILDZCQUFLLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7WUFFdkIsb0JBQUMsZ0NBQWE7Z0JBRVYsb0JBQUMseUJBQU07b0JBRUgsb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFDLFNBQVM7d0JBRXZCOzRCQUNJLG9CQUFDLGVBQU0sT0FBRTtvREFHUCxDQUVGO29CQUVSLG9CQUFDLHdCQUFLLElBQUMsS0FBSyxRQUFDLElBQUksRUFBQyxHQUFHO3dCQUNqQjs0QkFDSSxvQkFBQyxlQUFNLE9BQUU7d0RBR1AsQ0FFRjtvQkFFUixvQkFBQyx3QkFBSyxJQUFDLEtBQUssUUFBQyxJQUFJLEVBQUMsT0FBTzt3QkFFckI7NEJBQ0ksb0JBQUMsZUFBTSxPQUFFO29EQUVQLENBRUYsQ0FFSCxDQUVHLENBRWQsQ0FFVCxDQUFDO0lBQ04sQ0FBQztDQUdKO0FBRUQsa0JBQWUsR0FBRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtCcm93c2VyUm91dGVyLCBIYXNoUm91dGVyLCBMaW5rLCBSb3V0ZSwgU3dpdGNofSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xuaW1wb3J0IHtTaW1wbGVUb29sdGlwRXh9IGZyb20gXCIuLi8uLi9qcy91aS90b29sdGlwL1NpbXBsZVRvb2x0aXBFeFwiO1xuaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCIuL05hdmJhclwiO1xuXG5jbGFzcyBBcHA8UD4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8e30sIElBcHBTdGF0ZT4ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IFAsIGNvbnRleHQ6IGFueSkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW46ICc1cHgnfX0+XG5cbiAgICAgICAgICAgICAgICA8QnJvd3NlclJvdXRlcj5cblxuICAgICAgICAgICAgICAgICAgICA8U3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nLyNoZWxsbyc+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIHRoZSBoZWxsbyBVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy8nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIGRlZmF1bHQgcGFnZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy91c2VyJz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIHRoZSB1c2VyIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cblxuICAgICAgICAgICAgICAgICAgICA8L1N3aXRjaD5cblxuICAgICAgICAgICAgICAgIDwvQnJvd3NlclJvdXRlcj5cblxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG5cbmludGVyZmFjZSBJQXBwU3RhdGUge1xuXG59XG5cblxuIl19