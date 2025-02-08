import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import JWT from "../../utils/jwt.config";
import jwt, { Secret } from "jsonwebtoken";
import {
  DEFAULT_TOKEN_EXPIRATION_LONG,
  DEFAULT_TOKEN_EXPIRATION_SHORT,
} from "../../utils/commonUtils"
import Password from "../../utils/password.config";
import { JwtPayload } from "jsonwebtoken";
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
      // const token = JWT.createToken(email, existingUser.role);
      const tokens = await generateAccessAndRefereshTokens(email);

      if (!tokens) {
        return res.status(500).send({ success: false, message: "Failed to generate tokens" });
      }
      
      const { accessToken, refreshToken } = tokens;
        const token=accessToken
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
        refreshToken
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


export const refreshAccessToken=async(req:Request,res:Response):Promise<Response>=>{
  const {incomingRefreshToken}=req.params
  if(!incomingRefreshToken){
    return res.send(401).send({
      status:false,
      message:"Unauthorized Request"
    })
  }
  let decodedToken: JwtPayload;
  // try {
  //   decodedToken = jwt.verify(incomingRefreshToken,secret) as JwtPayload;
  // } catch (error) {
  //   return res.status(401).send({
  //     success: false,
  //     message: "Invalid refresh token",
  //   });
  // }

  decodedToken=JWT.verifyToken(incomingRefreshToken)
  console.log(decodedToken)


  const userEmail = decodedToken.email;
    if (!userEmail) {
      return res.status(401).send({
        success: false,
        message: "Token does not contain email",
      });
    }

  const loggedInUser=await UserModel.findOne().where({email:userEmail}).exec()

  console.log(loggedInUser)
  if(!loggedInUser){
    return res.status(401).send({
      success:false,
      message:"Incoming refresh token is invalid"
    })
  }

  if(incomingRefreshToken!=loggedInUser.refreshToken){
    return res.status(404).send({
      success:false,
      message:"Refresh Token is invalid"
    })
  }

  const normalToken=JWT.createToken(loggedInUser.email,loggedInUser.role)
  const refreshToken=JWT.generateRefreshToken(loggedInUser.email,loggedInUser.role)
  return res.status(200).send({
    success:true,
    message:"Token is refreshed",
    normalToken:normalToken,
    refreshToken:refreshToken
  })




}

const generateAccessAndRefereshTokens = async(email:string) =>{
  try {
      const user = await UserModel.findOne().where({email:email}).exec()
      if(!user){
        return;
      }
      
      const accessToken = JWT.createToken(user?.email,user?.role)
      const refreshToken = JWT.generateRefreshToken(email,user?.role)
      if(!refreshToken){
        return
      }
      user.refreshToken = refreshToken
      await UserModel.updateOne(
        { email: user.email },
        { $set: { refreshToken } }
      );

      return {accessToken, refreshToken}


  } catch (error) {
     console.log(error)
  }
}


export default loginController