import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import projectRoutes from '../routes';
import helmet from 'helmet'
import morgan from "morgan";
import errorHandler from "errorhandler";

/**
 * expressConfig - Sets up the configuration for an Express application.
 * @param {express.Application} app - An instance of the Express application.
 */

const expressConfig = (app: express.Application) => {
    app.use(cors({ credentials: true }));

    // Enable response compression middleware for reducing data size
    //app.use(compression());
  
    // Parse JSON request bodies
    app.use(bodyParser.json());
  
    // Parse cookies from incoming requests
    app.use(cookieParser());
  
    // Enhance security with HTTP headers using Helmet middleware
    app.use(
      helmet.hsts({
        maxAge: 31536000, // One year in seconds
        includeSubDomains: true,
        preload: true,
      })
    ); // Enable HTTP Strict Transport Security (HSTS) header
  
    // Log HTTP requests and responses in a development-friendly format
    app.use(morgan("dev"));

    for (const route of projectRoutes) {
        app.use(route.path, route.component);
      }
    
      // Error handling middleware (used only during development)
      if (process.env.NODE_ENV === "development") {
        app.use(errorHandler());
      }
};

export default expressConfig;
