import express from "express"
import cors from "cors"
const port = process.env.PORT || 3300
import router from "./routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)

app.listen(port, () => console.log("serve running on port " + port))