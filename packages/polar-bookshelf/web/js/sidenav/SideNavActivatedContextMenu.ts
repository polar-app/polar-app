import {TabID} from "./SideNavStore";

export namespace SideNavActivatedContextMenu {

    let current: TabID | undefined;

    export function set(id: TabID)  {
        current = id;
    }
    
    export function get(): TabID | undefined {
        return current;
    }

}