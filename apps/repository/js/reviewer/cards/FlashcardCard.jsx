"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardCard = void 0;
var React = require("react");
var react_1 = require("react");
var TaskBody_1 = require("./TaskBody");
var RatingButtons_1 = require("../RatingButtons");
var Preconditions_1 = require("polar-shared/src/Preconditions");
var Button_1 = require("@material-ui/core/Button");
var Divider_1 = require("@material-ui/core/Divider");
var CardPaper_1 = require("./CardPaper");
var card;
(function (card) {
    card.Body = function (props) {
        return (<CardPaper_1.CardPaper>
                {props.children}
            </CardPaper_1.CardPaper>);
    };
    card.Parent = function (props) { return (<div className="mt-3 pl-3 pr-3 flashcard-parent" style={{
        width: '100%',
    }}>
            {props.children}
        </div>); };
})(card || (card = {}));
var FrontCard = function (props) { return (<card.Parent>
        <card.Body>
            {props.children}
        </card.Body>
    </card.Parent>); };
var FrontAndBackCard = function (props) { return (<card.Parent>
        <card.Body>

            <div className="mb-4">
                {props.front}
            </div>

            <Divider_1.default />

            <div className="mt-4">
                {props.back}
            </div>

        </card.Body>
    </card.Parent>); };
/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
exports.FlashcardCard = function (props) {
    var _a = react_1.useState({ side: 'front' }), state = _a[0], setState = _a[1];
    function onShowAnswer() {
        setState({ side: 'back' });
    }
    function onRating(taskRep, rating) {
        props.onRating(taskRep, rating);
        setState({ side: 'front' });
    }
    Preconditions_1.Preconditions.assertPresent(props.front, 'front');
    Preconditions_1.Preconditions.assertPresent(props.back, 'back');
    var taskRep = props.taskRep;
    var Main = function () {
        switch (state.side) {
            case 'front':
                return (<FrontCard>
                        {props.front}
                    </FrontCard>);
            case 'back':
                return (<FrontAndBackCard front={props.front} back={props.back}/>);
            default:
                throw new Error("Invalid side: " + state.side);
        }
    };
    var Buttons = function () {
        switch (state.side) {
            case 'front':
                return (<Button_1.default color="primary" variant="contained" size="large" onClick={function () { return onShowAnswer(); }}>
                        Show Answer
                    </Button_1.default>);
            case 'back':
                return <RatingButtons_1.RatingButtons taskRep={taskRep} stage={taskRep.stage} onRating={onRating}/>;
            default:
                throw new Error("Invalid side: " + state.side);
        }
    };
    return <TaskBody_1.TaskBody taskRep={taskRep}>

        <TaskBody_1.TaskBody.Main taskRep={taskRep}>
            <Main />
        </TaskBody_1.TaskBody.Main>

        <TaskBody_1.TaskBody.Footer taskRep={taskRep}>

            <div className="mt-2 mb-2">
                <Buttons />
            </div>

        </TaskBody_1.TaskBody.Footer>

    </TaskBody_1.TaskBody>;
};
