"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
describe('TestDecorators', function () {
    it("basic decorators", function () {
        function Path(value) {
            return function (target, propertyKey, descriptor) {
                console.log("FIXME propertyKey", propertyKey);
                let paramtypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
                console.log("FIXME1:", Reflect.getMetadata("design:type", target, propertyKey));
                console.log("Within my annotation: ", paramtypes);
                target.path = value;
                console.log("FIXME: target", target);
                console.log("FIXME: descriptor", descriptor);
            };
        }
        class Address {
            constructor(city, state, zip) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }
        }
        class AddressHandler {
            handle(address) {
            }
        }
        __decorate([
            Path("/api/address"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Address]),
            __metadata("design:returntype", void 0)
        ], AddressHandler.prototype, "handle", null);
    });
});
//# sourceMappingURL=TestDecorators.js.map