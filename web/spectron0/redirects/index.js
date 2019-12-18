"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("READY");
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHVDQUE2QjtBQUU3QixjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFTLEVBQUU7SUFFdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUV6QixDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5hcHAub24oJ3JlYWR5JywgYXN5bmMgKCkgPT4ge1xuXG4gICAgY29uc29sZS5sb2coXCJSRUFEWVwiKTtcblxufSk7XG5cbiJdfQ==