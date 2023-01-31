import { Router } from "express"
import DatabaseController from "./controllers/DatabaseController"

const router = Router()

router.post("/database", DatabaseController.connection)
router.post("/saveRow", DatabaseController.save)
router.post("/deleteRow", DatabaseController.delete)

export default router