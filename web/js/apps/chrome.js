"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Launcher_1 = require("./Launcher");
const FirebasePersistenceLayerFactory_1 = require("../datastore/factories/FirebasePersistenceLayerFactory");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
function persistenceLayerFactory() {
    return __awaiter(this, void 0, void 0, function* () {
        const persistenceLayer = FirebasePersistenceLayerFactory_1.FirebasePersistenceLayerFactory.create();
        yield persistenceLayer.init();
        return persistenceLayer;
    });
}
new Launcher_1.Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hyb21lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5Q0FBb0M7QUFDcEMsNEdBQXVHO0FBQ3ZHLDZDQUF3QztBQUV4QyxNQUFNLEdBQUcsR0FBRyxlQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFNUIsU0FBZSx1QkFBdUI7O1FBRWxDLE1BQU0sZ0JBQWdCLEdBQUcsaUVBQStCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEUsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixPQUFPLGdCQUFnQixDQUFDO0lBRTVCLENBQUM7Q0FBQTtBQUVELElBQUksbUJBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLE1BQU0sRUFBRTtLQUN6QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGF1bmNoZXJ9IGZyb20gJy4vTGF1bmNoZXInO1xuaW1wb3J0IHtGaXJlYmFzZVBlcnNpc3RlbmNlTGF5ZXJGYWN0b3J5fSBmcm9tIFwiLi4vZGF0YXN0b3JlL2ZhY3Rvcmllcy9GaXJlYmFzZVBlcnNpc3RlbmNlTGF5ZXJGYWN0b3J5XCI7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2VyL0xvZ2dlcic7XG5cbmNvbnN0IGxvZyA9IExvZ2dlci5jcmVhdGUoKTtcblxuYXN5bmMgZnVuY3Rpb24gcGVyc2lzdGVuY2VMYXllckZhY3RvcnkoKSB7XG5cbiAgICBjb25zdCBwZXJzaXN0ZW5jZUxheWVyID0gRmlyZWJhc2VQZXJzaXN0ZW5jZUxheWVyRmFjdG9yeS5jcmVhdGUoKTtcbiAgICBhd2FpdCBwZXJzaXN0ZW5jZUxheWVyLmluaXQoKTtcbiAgICByZXR1cm4gcGVyc2lzdGVuY2VMYXllcjtcblxufVxuXG5uZXcgTGF1bmNoZXIocGVyc2lzdGVuY2VMYXllckZhY3RvcnkpLmxhdW5jaCgpXG4gICAgLnRoZW4oKCkgPT4gbG9nLmluZm8oXCJBcHAgbm93IGxvYWRlZC5cIikpXG4gICAgLmNhdGNoKGVyciA9PiBsb2cuZXJyb3IoZXJyKSk7XG5cblxuIl19