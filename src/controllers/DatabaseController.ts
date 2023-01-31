import { Request, Response } from "express";
import { Connection } from "../services/connection/Connection";
import DeleteRow from "../services/database/DeleteRow";
import GetTables from "../services/database/GetTables";
import SaveRow from "../services/database/SaveRow";

class DataBaseController {
    async connection(request: Request, response: Response){
        const { url, language } = request.body

        try {
            await Connection({ language, url})
            const result = await GetTables()

            return response.status(200).send({ result })
        } catch (error) {
            return response.status(400).send({ error })
        }
    }

    async save(request: Request, response: Response){
        const { update, table } = request.body
        try {
            const result = await SaveRow({ update, table })
            
            return response.status(200).send({ result })
        } catch (error) {
            return response.status(400).send({ error })
        }
    }

    async delete(request: Request, response: Response){
        const { table, row } = request.body
        try {
            await DeleteRow({ table, row })

            return response.status(200).send({ success: true })
        } catch (error) {
            console.log(error)
            return response.status(400).send({ error })
        }
    }
}

export default new DataBaseController()