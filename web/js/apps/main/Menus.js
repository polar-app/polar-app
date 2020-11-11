"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menus = void 0;
class Menus {
    static find(items, id) {
        if (!items) {
            return undefined;
        }
        const filtered = items.filter((current) => current.id === id);
        return filtered.pop();
    }
    static submenu(menuItem) {
        if (!menuItem) {
            return undefined;
        }
        return menuItem.submenu.items;
    }
    static setEnabled(menuItem, enabled) {
        menuItem.enabled = enabled;
    }
    static setVisible(menuItem, visible) {
        menuItem.visible = visible;
    }
}
exports.Menus = Menus;
//# sourceMappingURL=Menus.js.map