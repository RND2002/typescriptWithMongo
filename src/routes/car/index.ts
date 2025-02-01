import express from 'express'
import createCar from '../../controllers/cars/carController'
import { authenticate } from '../../middleWares/authMiddleWare'
const router=express.Router()

router.post('/',authenticate as any,createCar as any)

export default router