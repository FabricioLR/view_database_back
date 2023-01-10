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
const express_1 = require("express");
const pg_1 = require("pg");
const promise_1 = __importDefault(require("mysql2/promise"));
const router = (0, express_1.Router)();
router.post("/database", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, language } = request.body;
    try {
        if (language === "Mysql") {
            const result = {
                database: []
            };
            const pool = promise_1.default.createPool({
                uri: url
            });
            const connection = yield pool.getConnection();
            const tables = yield connection.execute("SHOW TABLES");
            yield Promise.all(tables[0].map((table) => __awaiter(void 0, void 0, void 0, function* () {
                const columns = [];
                const data = {
                    columns,
                    values: [],
                    table: ""
                };
                const values = yield connection.execute("SELECT * FROM " + Object.values(table)[0]);
                data.table = Object.values(table)[0];
                Object.keys(values[0][0]).map(collumn => columns.push(collumn));
                Object.values(values[0]).map((value) => data.values.push(value));
                result.database.push(data);
            })));
            return response.status(200).send({ result });
        }
        else {
            const result = {
                database: []
            };
            const pool = new pg_1.Pool({
                connectionString: url
            });
            const client = yield pool.connect();
            const tables = yield client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
            yield Promise.all(tables.rows.map((table) => __awaiter(void 0, void 0, void 0, function* () {
                const columns = [];
                const data = {
                    columns,
                    values: [],
                    table: ""
                };
                if (table.table_name !== "SequelizeMeta" && table.table_name !== "pg_stat_statements") {
                    const values = yield client.query(`SELECT * FROM ${table.table_name}`);
                    data.table = table.table_name;
                    values.fields.map(field => columns.push(field.name));
                    values.rows.map((row) => {
                        data.values.push(row);
                    });
                    result.database.push(data);
                }
            })));
            return response.status(200).send({ result });
        }
    }
    catch (error) {
        console.log(error);
        return response.status(400).send(error);
    }
}));
exports.default = router;
