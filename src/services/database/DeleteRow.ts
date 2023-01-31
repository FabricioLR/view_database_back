import { mysqlConnection, postgresqlConnection } from "../connection/Connection"

type DeleteRowData = {
    table: String
    row: {
        [key: string]: string | number | Object | boolean
        [key: number]: string | number | Object | boolean
    }
}

async function DeleteRow(data: DeleteRowData){
    if (!mysqlConnection && !postgresqlConnection) throw new Error("connection not available")

    try {
        if (mysqlConnection) {
            const query = Object.keys(data.row).map((key, index) => index == 0 ? "WHERE `" + key + "` = ?" : "AND `" + key + "` = ?").join(" ")
            const values = Object.values(data.row)

            await mysqlConnection.promise().query("SET SQL_SAFE_UPDATES = 0")
            await mysqlConnection.promise().query("DELETE FROM " + data.table + " " + query, values)
        } else {
            const query = Object.keys(data.row).map((key, index) => index == 0 ? "WHERE `" + key + "` = $" + Number(index + 1) : "AND `" + key + "` = $" + Number(index + 1)).join(" ")
            const values = Object.values(data.row)
            
            await postgresqlConnection!.query("DELETE FROM " + data.table + " " + query, values)
        }
    } catch (error: any) {
        throw error.message
    }
}

export default DeleteRow