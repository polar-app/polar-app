"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewFinished = exports.NoTasks = exports.CloudSyncRequired = void 0;
var React = require("react");
var CheckedSVGIcon_1 = require("../../../../web/js/ui/svg_icons/CheckedSVGIcon");
var SVGIcon_1 = require("../../../../web/js/ui/svg_icons/SVGIcon");
var react_router_dom_1 = require("react-router-dom");
var Button_1 = require("@material-ui/core/Button");
var ReviewLayout = function (props) {
    var history = react_router_dom_1.useHistory();
    var onContinue = function () {
        history.replace({ pathname: '/annotations', hash: "" });
    };
    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }}>

            <div className="text-center m-2" style={{ flexGrow: 1 }}>

                {props.children}

            </div>

            <div className="text-center m-2">

                <Button_1.default variant="contained" color="primary" size="large" onClick={onContinue}>
                    CONTINUE
                </Button_1.default>

            </div>

        </div>);
};
exports.CloudSyncRequired = function () { return (<ReviewLayout>
        <div className="text-center p-5">

            <h2>Cloud sync required (please login)</h2>

            <div className="p-3">
                <i className="fas fa-cloud-upload-alt text-danger" style={{ fontSize: '125px' }}/>
            </div>

            <h3 className="text-muted">
                Cloud sync is required to review annotations.  Please login to review flashcards and reading.
            </h3>

        </div>
    </ReviewLayout>); };
exports.NoTasks = function () { return (<ReviewLayout>
        <div className="text-center p-5">

            <h2>No tasks to complete</h2>

            <div className="p-3">
                <i className="far fa-check-circle text-primary" style={{ fontSize: '125px' }}/>
            </div>

            <h3 className="text-muted">
                Try creating some flashcards and let's try this again.
            </h3>

        </div>
    </ReviewLayout>); };
exports.ReviewFinished = function () { return (<ReviewLayout>

        <div className="text-center m-2" style={{ flexGrow: 1 }}>

            <div className="m-2">
                <SVGIcon_1.SVGIcon size={200}>
                    <CheckedSVGIcon_1.CheckedSVGIcon />
                </SVGIcon_1.SVGIcon>
            </div>

            <h2>Review Completed!</h2>

            <p className="text-muted text-xl">
                Nice.  Every time you review you're getting smarter and a step closer to your goal.  Great work!
            </p>

        </div>

    </ReviewLayout>); };
