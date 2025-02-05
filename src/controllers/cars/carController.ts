import { Request,Response } from "express";
import { CarModel } from "../../models/car";
import { UserModel } from "../../models/user"; 

import fs from 'fs';
import path from 'path';
import {  readFileFromLocation } from "../../utils/imageToBase64";


 const createCar = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, modelName, id } = req.body;
    if (!name || !modelName || !id) {
      return res.status(400).json({
        message: "Every field is mandatoryss",
        success: false,
      });
    }

    // Check if the user exists
    const existingUser = await UserModel.findById(id).exec();
    if (!existingUser) {
      return res.status(401).json({
        message: "User ID is not correct",
        success: false,
      });
    }

    // Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    // Save car details with uploaded image path
    const newCar = await CarModel.create({
      name,
      modelName,
      imagePath: req.file.path, // Save file path
      owner: id,
    });

    // Update user's car list
    await UserModel.findByIdAndUpdate(id, { $push: { cars: newCar._id } });

    return res.status(201).json({
      message: "Car created successfully",
      success: true,
      car: newCar,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Image file is not supported", success: false });
  }
};

 const getUserDataById=async (req:Request,res:Response):Promise<Response>=>{
  try{
    const { userId } = req.params;

    if (!userId) {
      return res.status(403).json({
          message: "User ID should be present in request",
          success: false
      });
  }

    const existingUser=await UserModel.findById(userId).exec()
    if (!existingUser) {
      return res.status(401).json({
        message: "User ID is not correct",
        success: false,
      });
    }

    return res.status(200).json({
      existingUser,
      success:true,
      message:"User and his car sent successfully"
    })


  }catch(error){
    console.error(error);
    return res.status(400).json({ message: String(error), success: false });
  }
}

 const getCarByCarIds = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { carIds } = req.params;

    if (!Array.isArray(carIds) || carIds.length === 0) {
      return res.status(400).json({
        message: "carIds must be a non-empty array",
        success: false,
      });
    }

    // Fetch all cars in a single query
    const cars = await CarModel.find({ _id: { $in: carIds } }).exec();

    return res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      cars,
    });

  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};




const getCarByUserId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    console.log(userId);

    // Check if the userId is provided
    if (!userId || userId.length === 0) {
      return res.status(403).json({
        success: false,
        message: "User Id is Missing",
      });
    }

    // Fetch cars for the given user
    const listOfCars = await CarModel.find({ owner: userId }).exec();
    if (!listOfCars || listOfCars.length === 0) {
      return res.status(201).json({
        success: false,
        message: "No cars found for this user",
      });
    }
    const newCarOnject=[]

    for(let i=0;i<listOfCars.length;i++){
      const  imageUrl=listOfCars[i].imagePath
      newCarOnject[i]={
        name:listOfCars[i].name,
        model:listOfCars[i].modelName,
        imageBase64:readFileFromLocation(imageUrl)
     }
     //newCarOnject[i]=newObj

      
    }

    

    //Logic to convert image to base64

    return res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      cars: newCarOnject,
    });


  
  }catch(error){
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      
    });
  }
};


// function getBase64(filePath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const fullPath = path.join(__dirname, '..', filePath); // Adjust path based on your server folder structure
//     fs.readFile(fullPath, { encoding: 'base64' }, (err, data) => {
//       if (err) {
//         reject('Error reading file: ' + err);
//       } else {
//         resolve(`data:image/jpeg;base64,${data}`); // Assuming JPEG images, adjust MIME type if needed
//       }
//     });
//   });
// }




export { createCar, getUserDataById,getCarByCarIds,getCarByUserId };


