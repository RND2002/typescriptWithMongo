import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import JWT from "../../utils/jwt.config";
import {
  DEFAULT_TOKEN_EXPIRATION_LONG,
  DEFAULT_TOKEN_EXPIRATION_SHORT,
} from "../../utils/commonUtils"
import Password from "../../utils/password.config";
/**
 * loginController - Handles user login authentication and response.
 *
 * @param {Request} req - The HTTP request object containing user input data.
 * @param {Response} res - The HTTP response object for sending responses to the client.
 *
 * @returns {Response} - Returns an HTTP response with status, message, success flag, and data.
 */


const loginController = async (req: Request, res: Response) : Promise<Response>=> {
    try {
        const { email, password, keepLogin } = req.body

        if (!email || !password) {
            return res.status(400).send({
                "message": "Email and Password are required",
                "success": "False"
            })
        }

        // Find the user by email in the database
        const existingUser = await UserModel.findOne({ email }).exec();

        // If no user is found, return a 404 Not Found response
        if (!existingUser) {
            return res.status(404).send({
                message: "Account not found with the provided email!",
                success: false,
            });
        }

        const hashedPassword=Password.comparePassword(existingUser.password,password)
        if(!hashedPassword){
            return res.status(404).send({
                "message":"Password is incorrent",
                "success":"False"
            })
        }
        const tokenExpiresIn = keepLogin
        ? DEFAULT_TOKEN_EXPIRATION_LONG
        : DEFAULT_TOKEN_EXPIRATION_SHORT;
  
      // Create a JSON Web Token (JWT) for the user
      const token = JWT.createToken(email, existingUser.role);
  
      // If token creation fails, return a 500 Internal Server Error response
      if (!token) {
        return res
          .status(500)
          .send({ message: "Can't create login token!", success: false });
      }

      const userPayload = {
        userDetails: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          username: existingUser.username,
          id:existingUser._id,
          role:existingUser.role
        },
        token,
      };

       // Update the last login time for the user in the database
    const now = Date.now();
    await UserModel.findByIdAndUpdate(existingUser._id, {
      lastLogin: now,
    }).exec();

      // Send a 200 OK response with login success message and user data
      return res.status(200).send({
        message: "Login successful!",
        success: true,
        data: userPayload,
      });
    } catch (error) {
      // Handle errors and return a 400 Bad Request response with the error message
      console.error(error);
      return res.status(400).send({ message: String(error), success: false });

    }
}

export default loginController