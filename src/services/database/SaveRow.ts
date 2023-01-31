import { mysqlConnection, postgresqlConnection } from "../connection/Connection"

type SaveRowData = {
    table: string,
    update: {
        [key: string]: string | number | Object | boolean
        [key: number]: string | number | Object | boolean
    }
}

async function SaveRow(data: SaveRowData) {
    try {
        if (!mysqlConnection && !postgresqlConnection) throw new Error("connection not available")
        const columns = Object.keys(data.update).join(", ")
        const values = Object.values(data.update)
        var row

        if (mysqlConnection){
            const index = Object.keys(data.update).map((value, index) => "?").join(", ")

            const result = await mysqlConnection.promise().query(`INSERT INTO ${data.table}(${columns}) VALUES(${index})`, values)

            if (!result) throw new Error("Could not save")

            const lastItem: any[][] = await mysqlConnection.promise().query(`SELECT * FROM ${data.table}`)
            row = lastItem[0][lastItem[0].length - 1]
        } else {
            const index = Object.keys(data.update).map((value, index) => String("$" + Number(index + 1))).join(", ")

            const result = await postgresqlConnection!.query(`INSERT INTO ${data.table}(${columns}) VALUES(${index}) RETURNING *`, values)

            if (!result) throw new Error("Could not save")
            row = result.rows[result.rows.length - 1]
        }

        return row
    } catch (error: any) {
        throw error.message
    }
}

export default SaveRow