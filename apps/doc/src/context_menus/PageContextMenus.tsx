import {Devices} from "polar-shared/src/util/Devices";
import * as ReactDOM from "react-dom";
import * as React from "react";
import {Logger} from "polar-shared/src/logger/Logger";
import {PageContextMenu} from "./PageContextMenu";
import {showContextMenu} from "@burtonator/react-context-menu-wrapper";
import {ReactInjector} from "../../../../web/js/ui/util/ReactInjector";

const log = Logger.create();

const id = 'page-context-menu';

export namespace PageContextMenus {

    interface Point {
        readonly x: number;
        readonly y: number;
    }

    interface TriggerEvent {
        readonly point: Point;
    }

    export function start() {

        if (Devices.isDesktop()) {

            create();

            const pageElements = Array.from(document.querySelectorAll(".page"));
            for (const pageElement of pageElements) {
                registerPageContextMenuListener(pageElement as HTMLElement);
            }

        } else {
            log.warn("Not running context menu on mobile device");
        }

    }

    export function create() {

        ReactInjector.inject(<PageContextMenu id={id}/>);

    }

    function registerPageContextMenuListener(targetElement: HTMLElement) {

        targetElement.addEventListener('contextmenu', (event) => {

            console.log("FIXME");
            trigger({
                point: {
                    x: event.pageX,
                    y: event.pageY
                }
            });

            event.preventDefault();

        });

    }

    function trigger(triggerEvent: TriggerEvent) {

        showContextMenu({
            id,
            data: null,
            x: triggerEvent.point.x,
            y: triggerEvent.point.y
        });

    }

}
