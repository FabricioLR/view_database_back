import app from "../app"
import { describe, it, expect } from "@jest/globals"
import request from "supertest"

//postgres://xfrzsrur:kSF3u4nTOR--Gu1mpgCapgNlj9GjshCf@peanut.db.elephantsql.com/xfrzsrur

describe("teste de conexao com banco de dados", () => {
    /* it("deve conectar no banco de dados postgresql", async () => {
        const response = await request(app).post("/database").send({
            url: "postgres://xfrzsrur:kSF3u4nTOR--Gu1mpgCapgNlj9GjshCf@peanut.db.elephantsql.com/xfrzsrur",
            language: "postgres"
        })

        expect(response.statusCode).toBe(200)
    }) */

    it("deve conectar no banco de dados mysql", async () => {
        const response = await request(app).post("/database").send({
            url: "mysql://root:123456@localhost:3306/users",
            language: "mysql"
        })

        expect(response.statusCode).toBe(200)
    })
})