import express from "express";
import {addBike, getBikes} from "../collection/bike.collection.js"

const router = express.Router()

router.route('/addbike').post(addBike)
router.route('/getbike').post(getBikes)


export default router