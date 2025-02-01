import express from 'express'
import createCar from '../../controllers/cars/carController'
import { authenticate } from '../../middleWares/authMiddleWare'
import upload from '../../middleWares/upload'
const router=express.Router()

router.post('/',authenticate as any,upload.single("image"),createCar as any)

export default router