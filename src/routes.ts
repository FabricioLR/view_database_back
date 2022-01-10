import { Router } from "express"
import { Client } from "pg"

const router = Router()

router.post("/database", async (req, res) => {
    const { username, host, database, password } = req.body

    const client = new Client({
        user: username,
        host,
        database,
        password,
        ssl: true
    })

    await client.connect()

    const list = []

    const response_table = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    for (const table of response_table.rows){
        const name = table.table_name
        if (name !== "SequelizeMeta" && name !== "pg_stat_statements"){
            const response = await client.query("SELECT * FROM " + name)
            list.push({ table: name, data: response.rows })
        }
    }

    return res.status(200).send({ db: list })
})

export default router