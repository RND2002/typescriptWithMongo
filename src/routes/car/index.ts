import express from 'express'

import { authenticate, authorizeRoles } from '../../middleWares/authMiddleWare'
import upload from '../../middleWares/upload'
import { createCar, getCarByCarIds, getCarByUserId, getUserDataById } from '../../controllers/cars/carController'
const router=express.Router()

router.post('/',authenticate as any,authorizeRoles("creator") as any,upload.single("image"),createCar as any)
router.get('/user/:userId', authenticate as any, getUserDataById as any);
router.get('/getAllCars/:userId',getCarByUserId as any)

export default router