"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Feedback_1 = require("../../../../../../web/js/ui/feedback/Feedback");
const Toaster_1 = require("../../../../../../web/js/ui/toaster/Toaster");
const NPSRef_1 = require("./NPSRef");
const Prefs_1 = require("../../../../../../web/js/util/prefs/Prefs");
class NPS extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.prefs = new Prefs_1.LocalStoragePrefs();
        this.onRated = this.onRated.bind(this);
    }
    render() {
        return (react_1.default.createElement(Feedback_1.Feedback, { category: 'net-promoter-score', title: 'How likely are you to recommend Polar?', from: "Not likely", to: "Very likely", onRated: () => this.onRated() }));
    }
    onRated() {
        Toaster_1.Toaster.success("Thanks for your feedback!");
        this.prefs.markDelayed(NPSRef_1.PREF_KEY, '1w');
    }
}
exports.NPS = NPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlBTLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTlBTLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUEwQjtBQUsxQiw0RUFBdUU7QUFDdkUseUVBQW9FO0FBQ3BFLHFDQUFrQztBQUNsQyxxRUFBNEU7QUFFNUUsTUFBYSxHQUFJLFNBQVEsZUFBSyxDQUFDLFNBQXlCO0lBSXBELFlBQVksS0FBYTtRQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFIQSxVQUFLLEdBQUcsSUFBSSx5QkFBaUIsRUFBRSxDQUFDO1FBSTdDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE1BQU07UUFFVCxPQUFPLENBRUgsOEJBQUMsbUJBQVEsSUFBQyxRQUFRLEVBQUMsb0JBQW9CLEVBQzdCLEtBQUssRUFBQyx3Q0FBd0MsRUFDOUMsSUFBSSxFQUFDLFlBQVksRUFDakIsRUFBRSxFQUFDLGFBQWEsRUFDaEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUU3QyxDQUFDO0lBQ04sQ0FBQztJQUVPLE9BQU87UUFFWCxpQkFBTyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRzdDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGlCQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFM0MsQ0FBQztDQUVKO0FBL0JELGtCQStCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCByZWFjdC9uby1tdWx0aS1jb21wOiAwLCByZWFjdC9wcm9wLXR5cGVzOiAwICovXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtTcGxhc2h9IGZyb20gJy4uLy4uL1NwbGFzaCc7XG5pbXBvcnQge1NwbGl0TGF5b3V0LCBTcGxpdExheW91dExlZnR9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3dlYi9qcy91aS9zcGxpdF9sYXlvdXQvU3BsaXRMYXlvdXQnO1xuaW1wb3J0IHtTcGxpdExheW91dFJpZ2h0fSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvdWkvc3BsaXRfbGF5b3V0L1NwbGl0TGF5b3V0UmlnaHQnO1xuaW1wb3J0IHtDYWxsVG9BY3Rpb25MaW5rfSBmcm9tICcuLi9jb21wb25lbnRzL0NhbGxUb0FjdGlvbkxpbmsnO1xuaW1wb3J0IHtGZWVkYmFja30gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL2ZlZWRiYWNrL0ZlZWRiYWNrJztcbmltcG9ydCB7VG9hc3Rlcn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL3RvYXN0ZXIvVG9hc3Rlcic7XG5pbXBvcnQge1BSRUZfS0VZfSBmcm9tICcuL05QU1JlZic7XG5pbXBvcnQge0xvY2FsU3RvcmFnZVByZWZzfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvdXRpbC9wcmVmcy9QcmVmcyc7XG5cbmV4cG9ydCBjbGFzcyBOUFMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SVByb3BzLCBJU3RhdGU+IHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJlZnMgPSBuZXcgTG9jYWxTdG9yYWdlUHJlZnMoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBJUHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLm9uUmF0ZWQgPSB0aGlzLm9uUmF0ZWQuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgIDxGZWVkYmFjayBjYXRlZ29yeT0nbmV0LXByb21vdGVyLXNjb3JlJ1xuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPSdIb3cgbGlrZWx5IGFyZSB5b3UgdG8gcmVjb21tZW5kIFBvbGFyPydcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tPVwiTm90IGxpa2VseVwiXG4gICAgICAgICAgICAgICAgICAgICAgdG89XCJWZXJ5IGxpa2VseVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25SYXRlZD17KCkgPT4gdGhpcy5vblJhdGVkKCl9Lz5cblxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25SYXRlZCgpIHtcblxuICAgICAgICBUb2FzdGVyLnN1Y2Nlc3MoXCJUaGFua3MgZm9yIHlvdXIgZmVlZGJhY2shXCIpO1xuXG4gICAgICAgIC8vIG1hcmsgaXQgZGVsYXllZCBzbyBpdCdzIG5vdCBzaG93biBhZ2Fpbi5cbiAgICAgICAgdGhpcy5wcmVmcy5tYXJrRGVsYXllZChQUkVGX0tFWSwgJzF3Jyk7XG5cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIElQcm9wcyB7XG59XG5cbmludGVyZmFjZSBJU3RhdGUge1xufVxuXG4iXX0=