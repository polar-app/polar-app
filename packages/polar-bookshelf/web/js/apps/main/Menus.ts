import MenuItem = Electron.MenuItem;

export class Menus {

    /**
     * Find an id within a given subMenu item.  Electron has broken bindings so
     * we have to do this by ourselves for the most part.
     *
     */
    public static find(items: Electron.MenuItem[] | undefined, id: string): MenuItem | undefined {

        if (!items) {
            return undefined;
        }

        const filtered = items.filter((current: any) => current.id === id)

        return filtered.pop();

    }

    /**
     * Get the menu items from a submenu.
     *
     * @param menuItem
     */
    public static submenu(menuItem: MenuItem | undefined): MenuItem[] | undefined {

        if (!menuItem) {
            return undefined;
        }

        return (<any> menuItem).submenu.items;

    }

    public static setEnabled(menuItem: MenuItem, enabled: boolean) {
        (<any> menuItem).enabled = enabled;
    }


    public static setVisible(menuItem: MenuItem, visible: boolean) {
        (<any> menuItem).visible = visible;
    }

}

