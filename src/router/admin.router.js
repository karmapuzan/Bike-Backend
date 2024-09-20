
import express from 'express'
import { adminlogin, adminlogout,createRefreshToken,getCurrentAdmin } from '../collection/admin.collection.js'

import { adminjwt } from '../middleware/authadmin.middleware.js'
const router = express.Router()

router.route('/login').post(adminlogin)
router.route('/logout').post(adminjwt, adminlogout)
router.route('/token').post(adminjwt, createRefreshToken)
router.route('/admin').get(adminjwt,getCurrentAdmin)

export default router