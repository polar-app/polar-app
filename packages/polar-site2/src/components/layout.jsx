"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutDocs = void 0;
var React = require("react");
var nav_1 = require("./nav");
var core_1 = require("@material-ui/core");
var react_helmet_1 = require("react-helmet");
var footer_1 = require("./footer");
var Layout = function (_a) {
    var children = _a.children;
    return (<React.Fragment>
      <react_helmet_1.Helmet>
        <core_1.CssBaseline />
      </react_helmet_1.Helmet>
      <nav_1.default />
      {children}
      <core_1.Box style={{ paddingBottom: "0px", width: "100%", bottom: 0 }}>
        <footer_1.default />
      </core_1.Box>
    </React.Fragment>);
};
exports.LayoutDocs = function (_a) {
    var children = _a.children;
    return (<React.Fragment>
      <react_helmet_1.Helmet>
        <core_1.CssBaseline />
      </react_helmet_1.Helmet>
      <nav_1.default />
      {children}
    </React.Fragment>);
};
exports.default = Layout;
