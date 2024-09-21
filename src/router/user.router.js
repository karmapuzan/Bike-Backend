import express from 'express'
import { registerUser, loginUser, getCurrentUser,logoutUser,refreshAccessToken,getAllUser, deleteUser} from '../collection/user.collection.js'
import { upload } from '../middleware/multer.middleware.js'
import { authjwt } from '../middleware/auth.middleware.js'
import { adminjwt } from '../middleware/authadmin.middleware.js'
const router = express.Router()

router.get('/', (req,res)=>{
    res.json({msg: "logout sucess"})
})

router.route('/register').post(upload.single('profile'), registerUser);
router.route('/login').post(loginUser)
router.route('/user').get(authjwt, getCurrentUser)
router.route('/logout').post(authjwt,logoutUser)
router.route('/refresh').post(authjwt,refreshAccessToken)
router.route('/getalluser').get(adminjwt, getAllUser)
router.route('/deleteuser').delete(adminjwt, deleteUser)





export default router