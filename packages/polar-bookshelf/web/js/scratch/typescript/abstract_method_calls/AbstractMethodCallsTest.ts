import {assert} from 'chai';
import "reflect-metadata";

describe('AbstractMethodCalls', function() {

    it("basic", function() {

        let handledGo = false;

        abstract class Vehicle {

            public go(): void {
                this.handleGo();
            }

            public abstract handleGo(): void;

        }

        class Car extends Vehicle {

            public handleGo(): void {
                handledGo = true;
            }

        }

        new Car().go();

        assert.ok(handledGo);

    });

});

