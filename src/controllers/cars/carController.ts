import { Request,Response } from "express";
import { CarModel } from "../../models/car";
import { UserModel } from "../../models/user"; 

const createCar=async (req:Request,res:Response):Promise<Response>=>{
   try{
    const {name,modelName,id}=req.body
    if(!name || !modelName || !id){
        return res.status(400).send({
            "message":"Every field is mandatory",
            "success":"false"
        })
    }

    const existingUser = await UserModel.findById(id).exec();
      if (!existingUser) {
         return res.status(401).json({
            message: "User ID is not correct",
            success: false
         });
      }

    const newCar=await CarModel.create({
        name:name,
        modelName,
        owner:id
    })

    await UserModel.findByIdAndUpdate(id, { $push: { cars: newCar._id } });
    return res.status(201).json({
        message: "Car created successfully",
        success: true,
        car: newCar
     });
   }catch (error) {
    // Handle errors and return a 400 Bad Request response with the error message
    console.error(error);
    return res.status(400).send({ message: String(error), success: false });

  }
}

export default createCar