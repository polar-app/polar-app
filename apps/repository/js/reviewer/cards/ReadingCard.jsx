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
exports.ReadingCard = void 0;
var React = require("react");
var TaskBody_1 = require("./TaskBody");
var AnnotationPreview_1 = require("../../annotation_repo/AnnotationPreview");
var RatingButtons_1 = require("../RatingButtons");
var CardPaper_1 = require("./CardPaper");
var ReadingCard = /** @class */ (function (_super) {
    __extends(ReadingCard, _super);
    function ReadingCard(props, context) {
        return _super.call(this, props, context) || this;
    }
    ReadingCard.prototype.render = function () {
        var taskRep = this.props.taskRep;
        var id = taskRep.id, action = taskRep.action, created = taskRep.created, color = taskRep.color;
        return <TaskBody_1.TaskBody taskRep={taskRep}>

            <TaskBody_1.TaskBody.Main taskRep={taskRep}>

                <CardPaper_1.CardPaper>
                    <AnnotationPreview_1.AnnotationPreview id={id} text={action.docAnnotation.text} img={action.docAnnotation.img} lastUpdated={action.docAnnotation.lastUpdated} created={created} color={color}/>
                </CardPaper_1.CardPaper>

            </TaskBody_1.TaskBody.Main>

            <TaskBody_1.TaskBody.Footer taskRep={taskRep}>

                <RatingButtons_1.RatingButtons taskRep={taskRep} stage={taskRep.stage} onRating={this.props.onRating}/>

            </TaskBody_1.TaskBody.Footer>

        </TaskBody_1.TaskBody>;
    };
    return ReadingCard;
}(React.Component));
exports.ReadingCard = ReadingCard;
