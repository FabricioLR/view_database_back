import { Router } from "express"
import { Pool, QueryArrayResult } from "pg"
import mysql from "mysql2/promise"

const router = Router()

type Result = {
    database: Data[]
}

type Data = {
    table: string
    columns: string[]
    values: {
        [key: string]: string
        [key: number]: string
    }[]
}

type QueryResponse = [
    {

    }
]

router.post("/database", async (request, response) => {
    const { url, language } = request.body

    try {
        if ( language === "Mysql" ){
            const result: Result = {
                database: []
            }

            const pool = mysql.createPool({
                uri: url
            })

            const connection = await pool.getConnection()

            const tables: any[] = await connection.execute("SHOW TABLES")

            await Promise.all(tables[0].map(async (table: any) => {
                const columns: string[] = []
                const data: Data = {
                    columns,
                    values: [],
                    table: ""
                }
                const values: any[] = await connection.execute("SELECT * FROM " + Object.values(table)[0])
                data.table = Object.values(table)[0] as string
                Object.keys(values[0][0]).map(collumn => columns.push(collumn))
                Object.values(values[0]).map((value: any) => data.values.push(value))
                
                result.database.push(data)
            }))

            return response.status(200).send({ result })
        } else {
            const result: Result = {
                database: []
            }
            
            const pool = new Pool({
                connectionString: url
            })
        
            const client = await pool.connect()
        
            const tables: QueryArrayResult = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")

            await Promise.all(tables.rows.map(async (table: any) => {
                const columns: string[] = []
                const data: Data = {
                    columns,
                    values: [],
                    table: ""
                }
                if (table.table_name !== "SequelizeMeta" && table.table_name !== "pg_stat_statements"){
                    const values: QueryArrayResult = await client.query(`SELECT * FROM ${table.table_name}`)
                    data.table = table.table_name
                    values.fields.map(field => columns.push(field.name))
                    values.rows.map((row: any) => {
                        data.values.push(row)
                    })

                    result.database.push(data)
                }
            }))
            
            return response.status(200).send({ result })
        }
    } catch (error: any) {
        return response.status(400).send({error: error.message})
    }
})

export default router