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
            React.createElement("p", null,
                "Location: ",
                document.location.href),
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                        React.createElement(react_router_dom_1.HashRouter, { hashType: "noslash" },
                            React.createElement(react_router_dom_1.Switch, null,
                                React.createElement(react_router_dom_1.Route, { exact: true, path: '/hello' },
                                    React.createElement("div", null,
                                        React.createElement(Navbar_1.Navbar, null),
                                        "this is the hello URL")),
                                React.createElement(react_router_dom_1.Route, { exact: true, path: '' },
                                    React.createElement("div", null,
                                        React.createElement(Navbar_1.Navbar, null),
                                        "this is the default page."))))),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/user' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the user page"))))));
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsdURBQWdGO0FBRWhGLHFDQUFnQztBQUVoQyxNQUFNLEdBQU8sU0FBUSxLQUFLLENBQUMsU0FBd0I7SUFFL0MsWUFBWSxLQUFRLEVBQUUsT0FBWTtRQUM5QixLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFCLENBQUM7SUFFTSxNQUFNO1FBRVQsT0FBTyxDQUVILDZCQUFLLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7WUFFdkI7O2dCQUNlLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNqQztZQUVKLG9CQUFDLGdDQUFhO2dCQUVWLG9CQUFDLHlCQUFNO29CQUVILG9CQUFDLHdCQUFLLElBQUMsS0FBSyxRQUFDLElBQUksRUFBQyxHQUFHO3dCQUVqQixvQkFBQyw2QkFBVSxJQUFDLFFBQVEsRUFBQyxTQUFTOzRCQUUxQixvQkFBQyx5QkFBTTtnQ0FFSCxvQkFBQyx3QkFBSyxJQUFDLEtBQUssUUFBQyxJQUFJLEVBQUMsUUFBUTtvQ0FFdEI7d0NBQ0ksb0JBQUMsZUFBTSxPQUFFO2dFQUdQLENBRUY7Z0NBRVIsb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFDLEVBQUU7b0NBQ2hCO3dDQUNJLG9CQUFDLGVBQU0sT0FBRTtvRUFHUCxDQUVGLENBRUgsQ0FFQSxDQUVUO29CQUVSLG9CQUFDLHdCQUFLLElBQUMsS0FBSyxRQUFDLElBQUksRUFBQyxPQUFPO3dCQUVyQjs0QkFDSSxvQkFBQyxlQUFNLE9BQUU7b0RBRVAsQ0FFRixDQUVILENBRUcsQ0FFZCxDQUVULENBQUM7SUFDTixDQUFDO0NBR0o7QUFFRCxrQkFBZSxHQUFHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge0Jyb3dzZXJSb3V0ZXIsIEhhc2hSb3V0ZXIsIExpbmssIFJvdXRlLCBTd2l0Y2h9IGZyb20gXCJyZWFjdC1yb3V0ZXItZG9tXCI7XG5pbXBvcnQge1NpbXBsZVRvb2x0aXBFeH0gZnJvbSBcIi4uLy4uL2pzL3VpL3Rvb2x0aXAvU2ltcGxlVG9vbHRpcEV4XCI7XG5pbXBvcnQge05hdmJhcn0gZnJvbSBcIi4vTmF2YmFyXCI7XG5cbmNsYXNzIEFwcDxQPiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7fSwgSUFwcFN0YXRlPiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogUCwgY29udGV4dDogYW55KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcblxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbjogJzVweCd9fT5cblxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICBMb2NhdGlvbjoge2RvY3VtZW50LmxvY2F0aW9uLmhyZWZ9XG4gICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAgPEJyb3dzZXJSb3V0ZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPFN3aXRjaD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy8nPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEhhc2hSb3V0ZXIgaGFzaFR5cGU9XCJub3NsYXNoXCI+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN3aXRjaD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy9oZWxsbyc+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIHRoZSBoZWxsbyBVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jyc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyBpcyB0aGUgZGVmYXVsdCBwYWdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvU3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9IYXNoUm91dGVyPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nL3VzZXInPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIHVzZXIgcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgIDwvU3dpdGNoPlxuXG4gICAgICAgICAgICAgICAgPC9Ccm93c2VyUm91dGVyPlxuXG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcblxuaW50ZXJmYWNlIElBcHBTdGF0ZSB7XG5cbn1cblxuXG4iXX0=