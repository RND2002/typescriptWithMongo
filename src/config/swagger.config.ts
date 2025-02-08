import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import authDocs from "../docs/auth.docs";
// 🔹 Define Swagger options
const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your Node.js & TypeScript app",
    },
    paths:{
        ...authDocs
    },
    servers: [
      {
        url: "http://localhost:3000", // Change this based on your server URL
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

// 🔹 Generate Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log("Swagger Docs available at http://localhost:5000/api-docs");
};
