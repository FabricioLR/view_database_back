import { QueryArrayResult } from "pg"
import { mysqlConnection, postgresqlConnection } from "../connection/Connection"

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

async function GetTables(){
    try {
        const result: Result = {
            database: []
        }
        
        if (!mysqlConnection && !postgresqlConnection) throw new Error("connection not available")

        if (mysqlConnection){
            const tables = ((await mysqlConnection.promise().query("SHOW TABLES"))[0] as any[]).map((table) => {return table.Tables_in_database})

            await Promise.all(tables.map(async (table) => {
                const columns: string[] = []
                const data: Data = {
                    columns,
                    values: [],
                    table: table
                }
                const values = (await mysqlConnection!.promise().query("SELECT * FROM " + table))[0] as any[]
                Object.keys(values[0]).map(collumn => columns.push(collumn))
                Object.values(values).map((value: any) => data.values.push(value))
                result.database.push(data) 
            }))
        } else {
            const tables: QueryArrayResult = await postgresqlConnection!.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
            await Promise.all(tables.rows.map(async (table: any) => {
                const columns: string[] = []
                const data: Data = {
                    columns,
                    values: [],
                    table: ""
                }
                if (table.table_name !== "SequelizeMeta" && table.table_name !== "pg_stat_statements"){
                    const values: QueryArrayResult = await postgresqlConnection!.query(`SELECT * FROM ${table.table_name}`)
                    data.table = table.table_name
                    values.fields.map(field => columns.push(field.name))
                    values.rows.map((row: any) => {
                        data.values.push(row)
                    })

                    result.database.push(data)
                }
            }))
        }
        return result
    } catch (error: any) {
        throw error.message
    }
}

export default GetTables