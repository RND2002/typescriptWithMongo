import { Request,Response } from "express";
import { CarModel } from "../../models/car";
import { UserModel } from "../../models/user"; 



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
    return res.status(400).json({ message: String(error), success: false });
  }
};

export default createCar;


