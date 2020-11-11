"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskBody = void 0;
var React = require("react");
var Divider_1 = require("@material-ui/core/Divider");
var TaskBody = /** @class */ (function (_super) {
    __extends(TaskBody, _super);
    function TaskBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskBody.prototype.render = function () {
        return this.props.children;
    };
    TaskBody.Main = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            return (<div className="p-1" style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }}>

                    <div style={{
                flexGrow: 1,
                display: 'flex'
            }}>

                        {this.props.children}

                    </div>

                </div>);
        };
        return class_1;
    }(React.Component));
    TaskBody.Footer = /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_2.prototype.render = function () {
            return <div>

                <Divider_1.default />

                <div className="mt-1 pl-1 pr-1">
                    <b>stage: </b> {this.props.taskRep.stage}
                </div>

                <div className="text-center p-1">
                    {this.props.children}
                </div>

            </div>;
        };
        return class_2;
    }(React.Component));
    return TaskBody;
}(React.Component));
exports.TaskBody = TaskBody;
