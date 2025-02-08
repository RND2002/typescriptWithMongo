const authDocs = {
    "/auth/login": {
      post: {
        summary: "User Login",
        description: "Authenticate a user and return an access token.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                  keepLogin: {
                    type: "boolean",
                    example: true,
                    description: "If true, a long-expiry token will be issued.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful!" },
                    data: {
                      type: "object",
                      properties: {
                        userDetails: {
                          type: "object",
                          properties: {
                            firstName: { type: "string", example: "John" },
                            lastName: { type: "string", example: "Doe" },
                            email: { type: "string", example: "john.doe@example.com" },
                            username: { type: "string", example: "johndoe" },
                            id: { type: "string", example: "64d9a4d7b5e4d1e1d5a8a9b3" },
                            role: { type: "string", example: "user" },
                          },
                        },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          404: { description: "Account not found or incorrect password" },
        },
      },
    },
  
    "/auth/refresh-token/{incomingRefreshToken}": {
      get: {
        summary: "Refresh Access Token",
        description: "Generates a new access token using a refresh token.",
        tags: ["Authentication"],
        parameters: [
          {
            name: "incomingRefreshToken",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            },
            description: "Refresh token obtained during login.",
          },
        ],
        responses: {
          200: {
            description: "Token refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Token is refreshed" },
                    normalToken: { type: "string", example: "newAccessTokenString" },
                    refreshToken: { type: "string", example: "newRefreshTokenString" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized - Invalid or expired refresh token" },
          404: { description: "Refresh token does not match stored token" },
        },
      },
    },
  };
  
  export default authDocs;
  