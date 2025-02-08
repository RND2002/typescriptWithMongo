import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import Password from "../../utils/password.config";
import { validatePassword } from "../../utils/commonUtils";
import nodemailer from "nodemailer";

// import { generateFromEmail } from "unique-username-generator";

/**
 * signupController - Handles user registration by validating input data, checking for existing accounts,
 * validating the password, hashing the password, generating a unique username, and creating a new user account.
 *
 * @param {Request} req - The HTTP request object containing user registration data.
 * @param {Response} res - The HTTP response object for sending responses to the client.
 *
 * @returns {Response} - Returns an HTTP response with a status code, message, and success flag.
 */

const signupController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, lastName, email, username, password,role } = req.body;

    // Check if required fields are provided; return 400 Bad Request if any are missing
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).send({
        message:
          "firstName, lastName, email,username and password are required!",
        success: false,
      });
    }

    // Check if an account with the provided email already exists; return 400 Bad Request if it does
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).send({
        message:
          "An account already exists with the provided email. Please log in or use a different email.",
        success: false,
      });
    }
    // Validate the password; return 400 Bad Request if it doesn't meet criteria
    const isPasswordValid = validatePassword(password);
    if (isPasswordValid !== true) {
      return res.status(400).send({
        message: isPasswordValid,
        success: false,
      });
    }

    // Hash the provided password for secure storage
    const hashedPassword = await Password.hashPassword(password);

    // Generate a unique username based on the email address
    //const uniqueUsername = generateFromEmail(email, 3);

    // Create a new user account in the database
    await UserModel.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      username: username,
      role:role
    });

    const jobOfferHtml = getJobOfferEmail(
      firstName + " " + lastName,
      "Software Engineer",
      "2024-09-15",
      "$80,000 per year",
      "https://aryandwi.netlify.app/",
      "75Way Technologies",
      "Aryan Dwivedi",
      "hr@75way@AryanDwivedi.com"
    );

    try {
      await sendEmailConfirmation( email,
        "Your Job Offer from Tech Corp!",
        "We are pleased to offer you a job at 75Way",
        jobOfferHtml);
    } catch (emailError) {
      return res.status(500).send({
        message: "Failed to send confirmation email. Please try again.",
        success: false,
      });
    }
    // Return a 200 OK response with a success message
    return res.status(200).send({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    // Handle errors and return a 400 Bad Request response with the error message
    console.error(error);
    return res.status(400).send({ message: String(error), success: false });
  }
};

const sendEmailConfirmation = async (
  recipient: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, // Use an App Password instead of your Gmail password
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipient,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};


const getJobOfferEmail = (
  candidateName: string,
  jobTitle: string,
  startDate: string,
  salary: string,
  offerUrl: string,
  companyName: string,
  managerName: string,
  hrEmail: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Offer Letter</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        h2 { color: #2c3e50; text-align: center; }
        p { font-size: 16px; line-height: 1.6; color: #333; }
        .highlight { color: #3498db; font-weight: bold; }
        .button { display: block; width: 200px; text-align: center; background: #27ae60; color: white; padding: 10px; margin: 20px auto; border-radius: 5px; text-decoration: none; font-size: 18px; }
        .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #888; }
      </style>
    </head>
    <body>

      <div class="container">
        <h2>Congratulations, You're Hired!</h2>

        <p>Dear <span class="highlight">${candidateName}</span>,</p>

        <p>We are pleased to offer you the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>. Your skills and experience impressed us, and we are excited to have you join our team.</p>

        <p>Your expected start date is <span class="highlight">${startDate}</span>. Below are some key details of your offer:</p>

        <ul>
          <li><strong>Position:</strong> ${jobTitle}</li>
          <li><strong>Salary:</strong> ${salary}</li>
          <li><strong>Reporting Manager:</strong> ${managerName}</li>
        </ul>

        <p>Please review the offer details and confirm your acceptance by clicking the button below:</p>

        <a href="${offerUrl}" class="button">Accept Offer</a>

        <p>If you have any questions, feel free to reach out to us at <a href="mailto:${hrEmail}">${hrEmail}</a>.</p>

        <p>Looking forward to welcoming you to our team!</p>

        <p>Best regards,</p>
        <p><strong>${managerName}</strong></p>
        <p><strong>${companyName}</strong></p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} ${companyName} | All Rights Reserved
        </div>
      </div>

    </body>
    </html>
  `;
};


export default signupController;
