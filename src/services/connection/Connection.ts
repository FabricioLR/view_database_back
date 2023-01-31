import { Pool, PoolClient } from "pg"
import { createPool, Pool as MPoll } from "mysql2"

type ConnectionData = {
    url: string
    language: string
}

var mysqlConnection: MPoll | null
var postgresqlConnection: PoolClient | null

async function Connection(data: ConnectionData){
    mysqlConnection = null
    postgresqlConnection= null
    try {
        if (data.language == "Mysql"){
            const pool = createPool({
                uri: data.url
            })

            pool.getConnection((error, connection) => {
                if (error) throw error
                connection.release()
            })

            mysqlConnection = pool

            if (!mysqlConnection) throw new Error("connection failed")

            return mysqlConnection
        } else {
            const pool = new Pool({
                connectionString: data.url
            })
        
            postgresqlConnection = await pool.connect()

            if (!postgresqlConnection) throw new Error("connection failed")

            return postgresqlConnection
        }
    } catch (error: any) {
        throw error.message
    }
}

export { Connection, mysqlConnection, postgresqlConnection }