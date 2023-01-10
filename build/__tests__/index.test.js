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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
//postgres://xfrzsrur:kSF3u4nTOR--Gu1mpgCapgNlj9GjshCf@peanut.db.elephantsql.com/xfrzsrur
(0, globals_1.describe)("teste de conexao com banco de dados", () => {
    /* it("deve conectar no banco de dados postgresql", async () => {
        const response = await request(app).post("/database").send({
            url: "postgres://xfrzsrur:kSF3u4nTOR--Gu1mpgCapgNlj9GjshCf@peanut.db.elephantsql.com/xfrzsrur",
            language: "postgres"
        })

        expect(response.statusCode).toBe(200)
    }) */
    (0, globals_1.it)("deve conectar no banco de dados mysql", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/database").send({
            url: "mysql://root:123456@localhost:3306/users",
            language: "mysql"
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
    }));
});
