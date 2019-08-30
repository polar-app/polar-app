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
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                        React.createElement(react_router_dom_1.HashRouter, null,
                            React.createElement(react_router_dom_1.Switch, null,
                                React.createElement(react_router_dom_1.Route, { exact: true, path: '/hello' },
                                    React.createElement("div", null,
                                        React.createElement(Navbar_1.Navbar, null),
                                        "this is the HELLO page :)")),
                                React.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                                    React.createElement("div", null,
                                        React.createElement("div", null,
                                            React.createElement(Navbar_1.Navbar, null),
                                            "this is the DEFAULT page.")))))),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/user' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the USER page"))))));
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsdURBQWdGO0FBRWhGLHFDQUFnQztBQUVoQyxNQUFNLEdBQU8sU0FBUSxLQUFLLENBQUMsU0FBd0I7SUFFL0MsWUFBWSxLQUFRLEVBQUUsT0FBWTtRQUM5QixLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFCLENBQUM7SUFFTSxNQUFNO1FBRVQsT0FBTyxDQUVILDZCQUFLLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7WUFFdkIsb0JBQUMsZ0NBQWE7Z0JBRVYsb0JBQUMseUJBQU07b0JBRUgsb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFDLEdBQUc7d0JBRWpCLG9CQUFDLDZCQUFVOzRCQUVQLG9CQUFDLHlCQUFNO2dDQUVILG9CQUFDLHdCQUFLLElBQUMsS0FBSyxRQUFDLElBQUksRUFBQyxRQUFRO29DQUV0Qjt3Q0FDSSxvQkFBQyxlQUFNLE9BQUU7b0VBR1AsQ0FFRjtnQ0FFUixvQkFBQyx3QkFBSyxJQUFDLEtBQUssUUFBQyxJQUFJLEVBQUMsR0FBRztvQ0FFakI7d0NBQ0k7NENBQ0ksb0JBQUMsZUFBTSxPQUFFO3dFQUdQLENBQ0osQ0FFRixDQUVILENBRUEsQ0FFVDtvQkFFUixvQkFBQyx3QkFBSyxJQUFDLEtBQUssUUFBQyxJQUFJLEVBQUMsT0FBTzt3QkFFckI7NEJBQ0ksb0JBQUMsZUFBTSxPQUFFO29EQUVQLENBRUYsQ0FFSCxDQUVHLENBRWQsQ0FFVCxDQUFDO0lBQ04sQ0FBQztDQUdKO0FBRUQsa0JBQWUsR0FBRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtCcm93c2VyUm91dGVyLCBIYXNoUm91dGVyLCBMaW5rLCBSb3V0ZSwgU3dpdGNofSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xuaW1wb3J0IHtTaW1wbGVUb29sdGlwRXh9IGZyb20gXCIuLi8uLi9qcy91aS90b29sdGlwL1NpbXBsZVRvb2x0aXBFeFwiO1xuaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCIuL05hdmJhclwiO1xuXG5jbGFzcyBBcHA8UD4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8e30sIElBcHBTdGF0ZT4ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IFAsIGNvbnRleHQ6IGFueSkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW46ICc1cHgnfX0+XG5cbiAgICAgICAgICAgICAgICA8QnJvd3NlclJvdXRlcj5cblxuICAgICAgICAgICAgICAgICAgICA8U3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nLyc+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SGFzaFJvdXRlcj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nL2hlbGxvJz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIEhFTExPIHBhZ2UgOilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy8nPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIHRoZSBERUZBVUxUIHBhZ2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvU3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9IYXNoUm91dGVyPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nL3VzZXInPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIFVTRVIgcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgIDwvU3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgPC9Ccm93c2VyUm91dGVyPlxuXG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcblxuaW50ZXJmYWNlIElBcHBTdGF0ZSB7XG5cbn1cblxuXG4iXX0=