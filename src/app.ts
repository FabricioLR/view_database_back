import express from "express"
import cors from "cors"
import routes from "./routes"

class App{
    express: any
    constructor(){
        this.express = express();

        this.middlewares()
        this.router()
    }
    middlewares(){
        this.express.use(cors())
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
    }
    router(){
        this.express.use(routes)
    }
}

export default new App().express