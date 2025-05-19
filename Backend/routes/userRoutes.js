import express from 'express'
import userAuth from '../middlewares/userAuth.js'
import { getUserData, sendemail } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.post('/sendemail', sendemail)

export default userRouter;