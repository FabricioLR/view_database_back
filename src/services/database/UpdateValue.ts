import { mysqlConnection, postgresqlConnection } from "../connection/Connection"

type UpdateValueData = {
    table: string
    row: {
        [key: string]: string | number | Object | boolean
        [key: number]: string | number | Object | boolean
    }
    update: {
        [key: string]: string | number | Object | boolean
        [key: number]: string | number | Object | boolean
    }
}

async function UpdateValue(data: UpdateValueData){
    try {
        if (!mysqlConnection && !postgresqlConnection) throw new Error("connection not available")
        if (mysqlConnection){
            const query = Object.keys(data.row).map((key, index) => index == 0 ? key + " = ?" : "AND " + key + " = ?").join(" ")
            const values = Object.values(data.row)
            
            await mysqlConnection.promise().query("UPDATE " + data.table + " SET ? WHERE " + query, [ { ...data.update }, ...values])
        } else {
            const query = Object.keys(data.row).map((key, index) => index == 0 ? key + " = $2" : "AND " + key + " = $" + Number(index + 2)).join(" ")
            const values = Object.values(data.row)
            values.unshift(Object.values(data.update)[0])
            
            await postgresqlConnection!.query("UPDATE " + data.table + " SET " + Object.keys(data.update)[0] + " = $1 WHERE " + query, [ ...values ])
        }
    } catch (error: any) {
        throw error.message
    }
}

export default UpdateValue