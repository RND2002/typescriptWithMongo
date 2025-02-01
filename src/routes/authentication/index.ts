import express from 'express'
import { Request,Response } from 'express'
import signupController from '../../controllers/authentication/signupController'
import loginController from '../../controllers/authentication/loginController'

const router=express.Router()

router.post('/login',loginController as any)
router.post('/signup',signupController as any)

export default router