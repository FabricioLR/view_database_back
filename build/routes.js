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
const express_1 = require("express");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
router.post("/database", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, host, database, password } = req.body;
    const client = new pg_1.Client({
        user: username,
        host,
        database,
        password,
        ssl: true
    });
    yield client.connect();
    const list = [];
    const response_table = yield client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    for (const table of response_table.rows) {
        const name = table.table_name;
        if (name !== "SequelizeMeta" && name !== "pg_stat_statements") {
            const response = yield client.query("SELECT * FROM " + name);
            list.push({ table: name, data: response.rows });
        }
    }
    return res.status(200).send({ db: list });
}));
exports.default = router;
